"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Session } from "next-auth";
import { FEATURE_FLAGS } from "@repo/shared";

interface ProfileInfoProps {
  session: Session | null;
}

const ProfileInfo = ({ session }: ProfileInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>View and update your account details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Name</p>
            <p>{session?.user?.name || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p>{session?.user?.email}</p>
          </div>
          <div>
            <p className="font-medium">Avatar</p>
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 text-white bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-xl">
                  {session?.user?.name?.[0] || "U"}
                </span>
              </div>
            )}
          </div>
          <Button
            className="mt-4"
            variant="outline"
            disabled={!FEATURE_FLAGS.EDIT_PROFILE}
          >
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
