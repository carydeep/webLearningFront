import React, { ReactElement } from "react";
import Lottie from "react-lottie";
import HomeLayout from "../../../components/Layouts/homeLayout";
import ProfileLayout from "../../../components/Layouts/profileLayout";
import UserLayout from "../../../components/Layouts/userLayout";
import Head from "next/head";
import { userOptions } from "../../../lotties";

function Profile() {
  return (
      <div className="text-center">
        <h3 className="fs-1">Chọn gì đó bên phải đi</h3>
        <Lottie options={userOptions} height={400} width={400}></Lottie>
      </div>
  );
}

export default Profile;

Profile.getLayout = function getLayout(page:ReactElement){
    return(
    <HomeLayout>
        <UserLayout>
            <ProfileLayout>
                <>
                <Head>
                <title>Chỉnh sửa thông tin</title>
                </Head>
                {page}
                </>
            </ProfileLayout>
        </UserLayout>
    </HomeLayout>
    )
}