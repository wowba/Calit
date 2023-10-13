import React from "react";
import { Route, Routes } from "react-router-dom";

// Routes
import PublicRoute from "./components/routes/PublicRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import ProjectCheckRoute from "./components/routes/ProjectCheckRoute";

// Pages
import Login from "./pages/LoginPage/Login";
import ProjectList from "./pages/ProjectListPage/ProjectList";
import Project from "./pages/ProjectPage/Project";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<ProjectList />} />
        <Route element={<ProjectCheckRoute />}>
          <Route path="/:projectId" element={<Project />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
