import { useParams } from "react-router-dom";
import Home from "./Home";

// This page renders the full Home page but with a specific project pre-opened
export default function ProjectPage() {
  const { projectId } = useParams();
  return <Home initialProjectId={projectId} />;
}