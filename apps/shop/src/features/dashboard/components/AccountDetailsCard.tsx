"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Session } from "next-auth";

interface AccountDetailsCardProps {
  session: Session | null;
}

const AccountDetailsCard = ({ session }: AccountDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Name:</span>{" "}
            {session?.user?.name || "Not provided"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {session?.user?.email}
          </p>
          <p>
            <span className="font-medium">Member since:</span>{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetailsCard;
