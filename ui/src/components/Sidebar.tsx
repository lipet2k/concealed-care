import Link from "next/link";
import { FiUser } from "react-icons/fi";
import { RiHospitalFill } from "react-icons/ri";
import { TbReportMedical } from "react-icons/tb";


const NavigationBar = () => {
  return (
    <div className="sidenav flex-col flex w-48">
      <div><img id="logo" src="/assets/cc-logo.svg"></img></div>
      <div className="links-container ml-10">
        <Link className="nav-item mt-5" href="/patients">
          <button className="btn-col-main hover:bg-blue-700 text-white py-2 px-4 rounded">
            <RiHospitalFill /> Patients
          </button>
        </Link>
        <Link className="nav-item mt-5" href="/profiles">
          <button className="bg-white text-black py-2 px-4 rounded">
            <FiUser /> Profile
          </button>
        </Link>

        <Link className="nav-item mt-5" href="/new_request">
          <button className="btn-col-main hover:bg-blue-700 text-white py-2 px-4 rounded">
            <TbReportMedical /> New Request
          </button>
        </Link>
      </div>
    </div>
  );
}



const Header = () => {

  return (
    <div className="heading-container bg-main">
      <div className="profile-info text-lg large-font heading-font shrink-0 mx-5 mt-2 ">
        <h3>Hospital</h3>
      </div>
      <NavigationBar />
    </div>
  );
}

export default Header
