import { useAppDispatch } from "@/Redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../designConstants/Header";
import Navigation from "../designConstants/Navigation";
import { Tasksheet } from "./Tasksheet";
import { fetchTeamDetails } from "@/Redux/TeamsDetails/TeamDetailsActions";
import TaskContainer from "./TaskType/TaskContainer";
import CustomAvatar from "../designConstants/CustomAvatar";
import {
  HoverCard,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HoverMemberInfo } from "../designConstants/HoverMemberInfo";
import SearchTaskComponent from "./SearchAndSortTask/SearchTask/SearchTaskComponent";
const TaskWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const teamId = searchParams.get("teamid");
  const teamData = useSelector((state: any) => state.teamData);
  const dispatch = useAppDispatch();
  const [isUserTeamAdmin, setIsUserTeamAdmin] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<{
    taskId: string;
    status: string;
    prevStatus: string;
  }>({ taskId: "", status: "", prevStatus: "" });
  const [unArrangedTasks, setUnArrangedTasks] = useState<any>([]);
  const [arrangedTasks, setArrangedTasks] = useState<any>({
    backlog: [],
    assigned: [],
    in_progress: [],
    review: [],
  });
  const [teamMembersDetails, setTeamMembersDetails] = useState([]);
  const [avatarUrls, setAvatarUrls] = useState([]);
  const statuses = [
    { label: "Backlog", value: "backlog" },
    { label: "Assigned", value: "assigned" },
    { label: "In Progress", value: "in_progress" },
    { label: "Review", value: "review" },
  ];
  console.log(avatarUrls);
  
  useEffect(() => {
    if (!teamId) {
      navigate("/teams"); // Redirect to an error page or homepage
    } else {
      getTeamDetails(teamId);
    }
  }, []);

  useEffect(() => {
    if (teamData?.getTeamDetailsResponse?.teamDetails) {
      setIsUserTeamAdmin(
        teamData?.getTeamDetailsResponse?.teamDetails[0]?.admin?.toString() ===
          localStorage?.getItem("userId")
      );
    }
    if (teamData?.allTaskOfTeam) {
      setUnArrangedTasks(teamData?.allTaskOfTeam);
    }
    if (teamData?.allTeamMembers) {
      let userDetails = teamData?.allTeamMembers?.map((user: any) => {
        return {
          userName: user?.name,
          userEmail: user?.email,
          avatar: user?.avatar,
        };
      });
      let avatarUrls = teamData?.allTeamMembers?.map((user: any) => {
        return user?.avatar;
      });

      setAvatarUrls(avatarUrls);
      setTeamMembersDetails(userDetails);
    }
  }, [teamData]);
  useEffect(() => {
     if (unArrangedTasks) {
       const taskByStatus: any = {
         backlog: [],
         assigned: [],
         in_progress: [],
         review: [],
       };
       unArrangedTasks?.forEach((task: any) => {
         taskByStatus[task?.status] && taskByStatus[task?.status].push(task);
       });
       setArrangedTasks(taskByStatus);
     }
  }, [unArrangedTasks]);
  function getTeamDetails(teamId: any) {
    const requestHeader = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    dispatch(fetchTeamDetails(requestHeader, teamId));
  }
  // const avatarUrls = [
  //   "https://avatars.githubusercontent.com/u/16860528",
  //   "https://avatars.githubusercontent.com/u/20110627",
  //   "https://avatars.githubusercontent.com/u/106103625",
  //   "https://avatars.githubusercontent.com/u/59228569",
  // ];
  return (
    <div className="page-wrapper">
      <Navigation />
      <div className="inner-wrapper">
        {" "}
        <Header />
        <section className="team-section">
          <>
            <header className="section-header my-7 px-5 flex flex-row-reverse justify-between">
              <div className="flex flex-row-reverse gap-10 items-center">
                <Tasksheet
                  source={"createTask"}
                  teamMembers={teamData?.allTeamMembers}
                  teamId={teamId ? teamId : ""}
                />
                {/* <img className="w-64" src={groupPic1} /> */}
                {/* <AvatarCircles  avatarUrls={avatarUrls} /> */}
                <SearchTaskComponent
                  allTaskData={teamData?.allTaskOfTeam}
                  unArrangedTasks={unArrangedTasks}
                  setUnArrangedTasks={setUnArrangedTasks}
                />
              </div>
              <div className="flex flex-row">
                {teamMembersDetails.map((member: any) => (
                  <HoverCard>
                    <HoverCardTrigger>
                      <CustomAvatar
                        src={member?.avatar}
                        alt="Avatar"
                        size="40px"
                      />
                    </HoverCardTrigger>
                    <HoverMemberInfo teamMembersDetails={member} />
                  </HoverCard>
                ))}
              </div>
            </header>
            <div className="task-wrapper">
              {statuses.map((status) => {
                return (
                  <TaskContainer
                    key={status.value}
                    status={status.value}
                    title={status.label}
                    tasks={arrangedTasks[status.value]}
                    teamMembers={teamData?.allTeamMembers}
                    teamId={teamId ? teamId : ""}
                    isUserTeamAdmin={isUserTeamAdmin}
                    updatedStatus={updatedStatus}
                    setUpdatedStatus={setUpdatedStatus}
                  />
                );
              })}
            </div>
          </>
        </section>
      </div>
    </div>
  );
};

export default TaskWrapper;
