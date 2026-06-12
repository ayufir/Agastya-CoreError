// import { useState } from "react";
// import { Menu } from "lucide-react";

// import MenuItems from "./MenuItems";

// import { Drawer } from "antd";

// const SideBar = () => {
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   return (
//     <>
//       {/* <Header/> */}
//       {/* Desktop Sidebar */}
//       <div className='hidden lg:flex   h-screen w-64 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.05)] rounded-r-2xl border-r border-gray-200 p-4'>
//         <MenuItems />
//       </div>

//       {/* Mobile Menu Toggle */}
//       <div className='bg-[#C40C0C] absolute p-4 flex items-center justify-between lg:hidden shadow-md'>
//         <button
//           className='text-white focus:outline-none'
//           onClick={() => setShowMobileMenu(true)}
//         >
//           <Menu size={24} />
//         </button>
//         <h1 className='text-white font-semibold text-lg'>Menu</h1>
//       </div>

//       {/* Mobile Drawer */}
//       <Drawer
//         open={showMobileMenu}
//         placement='left'
//         width={280}
//         onClose={() => setShowMobileMenu(false)}
//         bodyStyle={{
//           padding: "20px",
//           background: "#ffffff",
//           boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)",
//           borderTopRightRadius: "20px",
//           borderBottomRightRadius: "20px",
//         }}
//         headerStyle={{ display: "none" }}
//         closable={false}
//       >
//         <div className='flex justify-end mb-4'>
//           <button
//             className='text-gray-600 hover:text-red-600 transition'
//             onClick={() => setShowMobileMenu(false)}
//           >
//             ✕
//           </button>
//         </div>
//         <MenuItems />
//       </Drawer>
//     </>
//   );
// };

// export default SideBar;

//! abhishek code

import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import MenuItems from "./MenuItems";
import { Drawer } from "antd";
import { useState } from "react";

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className='hidden lg:flex h-screen '>
        {/* Collapsed Sidebar */}
        <div
          className={`${
            isCollapsed ? "w-20" : "w-64"
          } transition-all duration-300 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.05)] rounded-r-2xl border-r border-gray-200`}
        >
          {isCollapsed ? (
            <div className='p-2'>
              <button
                className='h-12 w-12 mt-4 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full mx-auto'
                onClick={() => setIsCollapsed(false)}
              >
                <Menu size={24} />
              </button>
            </div>
          ) : (
            <div className='p-4 h-full flex flex-col'>
              <div className='flex-1'>
                <MenuItems />
              </div>
              <button
                className='self-end p-2  absolute top-20 text-red-600 hover:bg-gray-100 rounded-full'
                onClick={() => setIsCollapsed(true)}
              >
                <ChevronLeft size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Toggle (Floating Button) */}
      <button
        onClick={() => setShowMobileMenu(true)}
        className='lg:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-[#C40C0C] text-white rounded-full shadow-2xl hover:bg-red-700 active:scale-95 transition-all'
        style={{ boxShadow: "0 4px 14px rgba(196, 12, 12, 0.4)" }}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Drawer */}
      <Drawer
        open={showMobileMenu}
        placement='left'
        width={280}
        onClose={() => setShowMobileMenu(false)}
        // bodyStyle={{
        //   padding: "20px",
        //   background: "#ffffff",
        //   boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)",
        //   borderTopRightRadius: "20px",
        //   borderBottomRightRadius: "20px",
        // }}
        styles={{
          body: {
            padding: "20px",
            background: "#ffffff",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
          },
          header: {
            display: "none",
          },
        }}
        closable={false}
      >
        <div className='flex justify-end mb-4'>
          <button
            className='text-gray-600 hover:text-red-600 transition font-extrabold'
            onClick={() => setShowMobileMenu(false)}
          >
            ✕
          </button>
        </div>
        <MenuItems />
      </Drawer>
    </>
  );
};

export default SideBar;
