import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo-side.svg';
import Button from '../Button/Button';
import Path from '../../utils/path';
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-multilevel-dropdown';
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx';
import { apiLogOut } from '../../apis/user';
// import { Button } from 'primereact/button';
import { NavLink } from 'react-router-dom';
import { logout } from '../../store/User/userSlice';
import { toast } from 'react-toastify';
import { apiCategory } from '../../apis/category';
import { ProfileMenu } from '../ProfileMenu/ProfileMenu';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [category, setCategory] = useState([]);
    const [payload, setPayload] = useState({
        keyword: "",
    });
    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            const trimmedKeyword = payload.keyword.trim();
            const newPath = `/courses/search/${trimmedKeyword}`;
            // If already on the search path, force re-render by changing key
            // navigate('/a', { state: { key: 'empty' } });
            navigate(newPath);
        }
    };
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const categoryData = await apiCategory({ build_type: 'TREE' });
                setCategory(categoryData.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategory();
    }, [token]);
    const renderCategory = (category) => {
        return (
            <Dropdown.Item key={category.id} position='right'>
                {
                    <span className='flex justify-between w-full'>
                        <span>
                            {category.title}
                        </span>
                        {category.children.length > 0 && (<span>{'>'}</span>)}
                    </span>

                }
                {category.children.length > 0 && (
                    <Dropdown.Submenu position='right'>
                        {category.children.map((child) => renderCategory(child))}
                    </Dropdown.Submenu>
                )}
            </Dropdown.Item>
        );
    };
    const handleLogout = (() => {
        console.log("logout");
        apiLogOut().then(() => {
            navigate(`/${Path.HOME}`);

            dispatch(logout());
            toast.success(`Đăng xuất thành công`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        );
    });
    return (
        <div className='fixed z-50'>
            <div className='w-main  flex items-center gap-5  shadow-lg transition bg-white justify-between px-[20px]'>
                <div className="flex items-center flex-1">
                    <div className='px-7 py-2 flex justify-center'>
                        <NavLink to={Path.HOME}>
                            <img src={logo} className='w-[91px] h-[35px]' />
                        </NavLink>

                    </div>
                    <div className='px-7 py-5 font-semibold mr-[25px] relative text-center'>
                        <Dropdown title='Danh mục' openOnHover={true} position='right'>
                            {category.map((category) => renderCategory(category))}
                        </Dropdown>
                        {/* <div className=' absolute top-[4.3rem] min-h-[20rem] min-w-[10rem] shadow-lg'>
                        <div className='absolute w-[10rem] h-[20px] top-[-1rem] right-0'></div>
                        <ul>
                            <li className='px-5 py-2'>
                                c-1
                            </li>
                            <li className='px-5 py-2'>
                                c-2
                            </li>
                            <li className='px-5 py-2'>
                                c-3
                            </li>
                            <li className='px-5 py-2'>
                                c-4
                            </li>
                            <li className='px-5 py-2'>
                                c-5
                            </li>
                        </ul>
                    </div> */}
                    </div>
                    <div className='flex items-center w-1/2'>
                        <input
                            type="text"
                            value={payload.keyword}
                            className='rounded-[50px] border-[#003a47] px-4 py-2 border w-full'
                            onChange={e => setPayload(prev => ({ ...prev, keyword: e.target.value }))}
                            onKeyDown={handleEnter}
                        />
                    </div>
                </div>
                <div className="flex items-center flex-2">
                    <div>
                        <div className='text-gray-800 font-semibold '>
                            Giảng dạy trên Wisdom
                        </div>
                    </div>
                    <div className={clsx('flex justify-center items-center gap-5 ml-[10px]  mr-4')}>
                        {isLoggedIn ? (
                            <div className=''>
                                <ProfileMenu handleLogout={() => handleLogout()} />
                                {/* <NavLink>
                                    <Button type="button" handleOnClick={handleLogout} children="Đăng xuất" style="bg-white w-[100px] h-[40px] ring-gray-300 hover:bg-gray-100" label="Đăng xuất" severity="secondary" outlined />
                                </NavLink> */}
                            </div>
                        ) : (
                            <>
                                <NavLink to={Path.LOGIN}>
                                    <Button type="button" children="Đăng nhập" style="bg-white w-[100px] h-[40px] ring-gray-300 hover:bg-gray-100" label="Đăng nhập" severity="secondary" outlined />
                                </NavLink>

                                <NavLink to={Path.REGISTER}>
                                    <Button children="Đăng ký" style="bg-[#29abe2] w-[100px] h-[40px] ring-gray-300 hover:bg-[#088ab7] text-white" label="Đăng ký" severity="info" rounded />
                                </NavLink>
                            </>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Navbar;