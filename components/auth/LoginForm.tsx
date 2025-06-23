import React from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/Card";

export function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button type="submit">Login</Button>
        </form>
      </CardContent>
    </Card>
  );
}