"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import Link from "next/link";

const QuickActionsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {/* <Button asChild variant="outline" size="sm">
          <Link href="/">Browse Products</Link>
        </Button> */}
        <Button asChild variant="outline" size="sm">
          <Link href="/contact-us">Contact Support</Link>
        </Button>
        <Button asChild variant="destructive" size="sm">
          <Link href="/signout">Sign Out</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
