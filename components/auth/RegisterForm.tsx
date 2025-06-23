import React from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/Card";

export function RegisterForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button type="submit">Register</Button>
        </form>
      </CardContent>
    </Card>
  );
}