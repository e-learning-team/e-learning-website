import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
} from "@material-tailwind/react";
import { NavLink, Outlet } from 'react-router-dom';
import Path from "../../utils/path";

export function Sidebar() {
    return (
        <div className="flex top-[80px] relative w-full">
            <div className="fixed w-60 z-10 ">
                <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] shadow-xl shadow-blue-gray-900/5">
                    {/* <div className="mb-2 p-4">
                    <Typography variant="h5" color="blue-gray">
                        Sidebar
                    </Typography>
                </div> */}
                    <List className="font-medium">
                        <NavLink className={({ isActive }) => (isActive ? 'bg-[#003a47] text-[#fff]' : 'text-[#003a47]')} to={Path.USER_P + Path.USER_PROFILE}  >
                            <ListItem>
                                Thông tin cá nhân
                            </ListItem>
                        </NavLink>
                        <hr className="relative left-0 right-0 my-2 border-black-200 focus-v !outline-none " />

                        <NavLink className={({ isActive }) => (isActive ? 'bg-[#003a47] text-[#fff]' : 'text-[#003a47]')} to={Path.USER_P + Path.USER_ENROLLMENT}  >
                            <ListItem>
                                Khóa học đã đăng kí
                            </ListItem>
                        </NavLink>

                        <NavLink className={({ isActive }) => (isActive ? 'bg-[#003a47] text-[#fff]' : 'text-[#003a47]')} to={Path.USER_P + Path.USER_BOOKMARK}  >
                            <ListItem>
                                Khóa học đã lưu
                            </ListItem>
                        </NavLink>

                        <hr className="relative left-0 right-0 my-2 border-black-200 focus-v !outline-none " />

                        <NavLink className={({ isActive }) => (isActive ? 'bg-[#003a47] text-[#fff]' : 'text-[#003a47]')} to={Path.USER_P + Path.USER_HISTORY}  >
                            <ListItem>
                                Lịch sử thanh toán
                            </ListItem>
                        </NavLink>
                        {/* <ListItem>
                        Settings
                    </ListItem> */}
                    </List>
                </Card>
            </div>
            <div className="relative m-6 pl-60 w-full">
                <Outlet />
            </div>
        </div>
    );
}