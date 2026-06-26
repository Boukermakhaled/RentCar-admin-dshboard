import { Link, useLocation, useNavigate } from "react-router";

import {

  PlugInIcon,

} from "../icons";
import { MdEventNote, MdOutlineEventNote  } from "react-icons/md";
import { IoCarSportOutline, IoCarSportSharp  } from "react-icons/io5";
import { GoHome, GoHomeFill } from "react-icons/go";

import { useSidebar } from "../context/SidebarContext";

import { useAuth } from "../context/AuthContext";



type NavItem = {

  name: string;

  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;

  path: string;

};



const navItems: NavItem[] = [

  {

    activeIcon: <GoHomeFill />,
    inactiveIcon: <GoHome />,
    name: "Dashboard",

    path: "/dashboard",

  },

  {

    activeIcon: <IoCarSportSharp />,
    inactiveIcon: <IoCarSportOutline />,

    name: "Cars",

    path: "/dashboard/cars",

  },

  {


    activeIcon: <MdEventNote /> ,
    inactiveIcon: <MdOutlineEventNote />,
    name: "Orders",

    path: "/dashboard/orders",

  },

];



const AppSidebar: React.FC = () => {

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const location = useLocation();

  const navigate = useNavigate();

  const { logout } = useAuth();



  const isActive = (path: string) => location.pathname === path;



  const handleLogout = async () => {

    await logout();

    navigate("/login", { replace: true });

  };



  return (

    <aside

      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 

        ${

          isExpanded || isMobileOpen

            ? "w-[290px]"

            : isHovered

            ? "w-[290px]"

            : "w-[90px]"

        }

        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}

        lg:translate-x-0`}

      onMouseEnter={() => !isExpanded && setIsHovered(true)}

      onMouseLeave={() => setIsHovered(false)}

    >

      <div

        className={`py-8 flex ${

          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"

        }`}

      >

        <Link to="/dashboard" className="flex items-center justify-center bg-white w-full rounded-lg">

          {isExpanded || isHovered || isMobileOpen ? (

            <>

              <img

                className=""

                src="/images/logo/logo.webp"

                alt="Logo"

                width={150}

                height={40}

              />


          </>

          ) : (

            <img

              src="/images/logo/logo.webp"

              alt="Logo"

              width={82}

              height={52}

            />

          )}

        </Link>

      </div>



      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">

        <nav className="mb-6">

          <ul className="flex flex-col gap-4">

            {navItems.map((nav) => (

              <li key={nav.path}>

                <Link

                  to={nav.path}

                  className={`menu-item group ${

                    isActive(nav.path)

                      ? "menu-item-active"

                      : "menu-item-inactive"

                  }`}

                >

                  <span

                    className={`menu-item-icon-size ${

                      isActive(nav.path)

                        ? "menu-item-icon-active"

                        : "menu-item-icon-inactive"

                    }`}

                  >
               {isActive(nav.path) ? nav.activeIcon : nav.inactiveIcon}

                  </span>

                  {(isExpanded || isHovered || isMobileOpen) && (

                    <span className="menu-item-text">{nav.name}</span>

                  )}

                </Link>

              </li>

            ))}

          </ul>

        </nav>



        <div className="mt-auto pb-6">

          <button

            type="button"

            onClick={handleLogout}

            className={`menu-item group menu-item-inactive w-full cursor-pointer ${

              !isExpanded && !isHovered

                ? "lg:justify-center"

                : "lg:justify-start"

            }`}

          >

            <span className="menu-item-icon-size menu-item-icon-inactive">

              <PlugInIcon />

            </span>

            {(isExpanded || isHovered || isMobileOpen) && (

              <span className="menu-item-text">Logout</span>

            )}

          </button>

        </div>

      </div>

    </aside>

  );

};



export default AppSidebar;


