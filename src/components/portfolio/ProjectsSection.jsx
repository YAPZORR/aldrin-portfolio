const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import ProjectCard from "./ProjectCard";
import ProjectSidePanel from "./ProjectSidePanel";
import { trackEvent } from "@/lib/analytics";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_PROJECTS = [
  {
    id: "d1", title: "OrderCake App", order: 1,
    mainImage: "https://media.db.com/images/public/69d0e5e320893aed44df939b/3098e29fc_generated_b35bf0e6.png",
    heroBackground: "linear-gradient(135deg, #ff6b9d, #c0392b)",
    services: ["Landing Page Design", "Mobile App Design", "Interface Design", "User Experience Design"],
    deliverables: ["Website and Application"], status: "In Development",
    tagline: "A white-label app designed for cake bakers and consumers.",
    audience: "OrderCake is a white-label app designed for cake bakers and enthusiasts. It offers a user-friendly interface, customizable features, and a seamless experience for designing, ordering, and enjoying cakes. This versatile platform aims to revolutionize the cake industry by catering to the unique needs of both professionals and consumers, making the entire process enjoyable and efficient.",
    challenges: "Recognizing the challenges in engaging clients to design and order cakes through both our website and app, we've strategically devised a solution. Our approach involves the creation of a neutral and user-friendly app, designed to captivate a broader audience within the cake industry. This innovative solution aims to streamline the process, making it more accessible and engaging for clients to unleash their creativity and seamlessly place cake orders.",
    collaborativeIntro: "In our continuous efforts to elevate the user experience, we're excited to unveil a groundbreaking feature—Enhanced Collaborative Design. This innovative addition empowers clients to collaborate seamlessly in real-time, enabling them to co-create unique cake designs effortlessly.",
    collaborativeInAction: "I am actively collaborating with my manager to seamlessly transform their vision into reality. Despite the ongoing development phase of the project, I am engaged in a collective effort with other skilled Flutter programmers. Together, we are working cohesively to enhance and refine the project, ensuring that every aspect aligns with the envisioned idea. This collaborative approach not only promotes a dynamic and efficient workflow but also contributes to the overall success and innovation of the project.",
    whatIDid: JSON.stringify([
      { title: "Meeting and Design Discussion", description: "I participated in a team discussion to outline the app's process and features. Collaboratively, we deliberated on the intricate details to ensure a comprehensive approach. Our goal was to enhance functionality and user experience, paving the way for a successful and innovative application." },
      { title: "Searching design inspiration", description: "I often seek design inspiration for unfamiliar projects. The concept of a white-label app is novel to me, and exploring its possibilities adds an exciting dimension to my design exploration." },
      { title: "WireFraming", description: "In the majority of my projects, I typically craft low-fidelity designs to elucidate the user process effectively. These simplified representations serve as a concise yet comprehensive means of conveying the intended user journey and system interactions." },
      { title: "High Fidelity Design", description: "Transitioning from low fidelity, I elevate my design approach to high fidelity, incorporating detailed visual elements, polished aesthetics, and precise interactions. This refined stage ensures a more accurate representation of the final product, offering a comprehensive and visually compelling user experience." }
    ]),
    whatILearned: "I've learned the importance of meticulously paying attention to every detail of a project. Additionally, I've honed the skill of integrating research and seeking design inspiration, particularly for unfamiliar projects. This approach ensures a comprehensive understanding and a well-rounded execution of design concepts."
  },
  {
    id: "d2", title: "Service Booking App", order: 2,
    mainImage: "https://media.db.com/images/public/69d0e5e320893aed44df939b/b130d3ff1_generated_202ea074.png",
    heroBackground: "linear-gradient(135deg, #4834d4, #686de0)",
    services: ["Interface Design", "User Experience Design"], deliverables: ["Mobile Application"], status: "Completed",
    tagline: "A seamless service booking experience for 2030 and beyond.",
    audience: "Designed for users who need to book services quickly and efficiently through a modern mobile interface.",
    challenges: "Creating an intuitive booking flow that minimizes friction while providing all necessary information to the user.",
    whatIDid: JSON.stringify([
      { title: "User Research", description: "Conducted in-depth research on user needs and pain points in the service booking space." },
      { title: "Information Architecture", description: "Designed a clear and logical flow for the booking process from discovery to confirmation." },
      { title: "High Fidelity Design", description: "Created polished UI components with a bold blue gradient theme and clean typography." }
    ]),
    whatILearned: "Learned the importance of progressive disclosure in booking flows—showing only what the user needs at each step greatly reduces cognitive load."
  },
  {
    id: "d3", title: "E-commerce Portal Design", order: 3,
    mainImage: "https://media.db.com/images/public/69d0e5e320893aed44df939b/2f60e34e9_generated_432cc3c9.png",
    heroBackground: "linear-gradient(135deg, #f9ca24, #f0932b)",
    services: ["Landing Page Design", "Interface Design", "User Experience Design", "User Portal"],
    deliverables: ["Website"], status: "In Development",
    tagline: "A modern subscription-based e-commerce platform.",
    audience: "Designed for subscription-based e-commerce businesses looking to provide a seamless ordering and account management experience for their customers.",
    challenges: "Balancing a feature-rich account portal with a clean, uncluttered UI required careful prioritization of user tasks and a strong visual hierarchy.",
    collaborativeInAction: "Working closely with the development team to ensure the design handoff was seamless, with detailed component documentation and interactive prototypes.",
    whatIDid: JSON.stringify([
      { title: "Competitive Analysis", description: "Analyzed top e-commerce platforms to identify best practices and gaps in the subscription management experience." },
      { title: "User Flow Design", description: "Mapped out the complete user journey from product discovery to subscription management." },
      { title: "Component Design", description: "Built a comprehensive design system with reusable components for consistent UI across the platform." }
    ]),
    whatILearned: "Understanding subscription business models deeply before designing helped create a more intuitive and business-aligned user experience."
  },
  {
    id: "d4", title: "Analytics Dashboard", order: 4,
    mainImage: "https://media.db.com/images/public/69d0e5e320893aed44df939b/c982a92d6_generated_1adea8fd.png",
    heroBackground: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
    services: ["Dashboard Design", "Data Visualization"], deliverables: ["Web Application"], status: "Completed",
    tagline: "Turning complex data into clear, actionable insights.",
    audience: "Business analysts and managers who need real-time data visualization and reporting tools.",
    challenges: "Presenting dense data in a way that is immediately understandable without sacrificing depth for power users.",
    whatIDid: JSON.stringify([
      { title: "Data Mapping", description: "Worked with stakeholders to understand which metrics were most critical for decision-making." },
      { title: "Chart Design", description: "Selected appropriate chart types for each data set to ensure clarity and accuracy." },
      { title: "Dark Theme UI", description: "Designed a sophisticated dark-themed interface that reduces eye strain during extended use." }
    ]),
    whatILearned: "Data visualization design requires strong collaboration with data teams — understanding the data structure is just as important as the visual design."
  },
  {
    id: "d5", title: "Fitness Tracker App", order: 5,
    mainImage: "https://media.db.com/images/public/69d0e5e320893aed44df939b/2450967bd_generated_65dada60.png",
    heroBackground: "linear-gradient(135deg, #00b894, #00cec9)",
    services: ["Mobile App Design", "UI/UX Design"], deliverables: ["Mobile Application"], status: "Completed",
    tagline: "Motivating users to reach their fitness goals every day.",
    audience: "Health-conscious individuals aged 18–40 who want to track workouts, nutrition, and progress in one place.",
    challenges: "Keeping users engaged long-term with habit-forming design patterns while making the app accessible to beginners.",
    whatIDid: JSON.stringify([
      { title: "Gamification Research", description: "Researched engagement mechanics from top fitness apps to design motivating progress systems." },
      { title: "Onboarding Flow", description: "Designed a personalized onboarding that sets user goals and fitness levels from the start." },
      { title: "Progress Visualization", description: "Created compelling charts and milestone badges to reward user achievements." }
    ]),
    whatILearned: "The most successful fitness apps balance data richness with emotional motivation — users need to feel good about progress, not overwhelmed by metrics."
  },
  {
    id: "d6", title: "Dental Clinic Website", order: 6,
    mainImage: "https://media.db.com/images/public/69d0e5e320893aed44df939b/ce01c591d_generated_d4cfb82b.png",
    heroBackground: "linear-gradient(135deg, #74b9ff, #0984e3)",
    services: ["Landing Page Design", "Website Design"], deliverables: ["Website"], status: "Completed",
    tagline: "A clean, trustworthy online presence for dental professionals.",
    audience: "Local dental clinic patients looking for appointment booking, service information, and clinic details.",
    challenges: "Healthcare websites need to convey trust and professionalism while remaining approachable and easy to navigate.",
    whatIDid: JSON.stringify([
      { title: "Brand Analysis", description: "Reviewed the clinic's existing brand identity to inform the visual direction of the new website." },
      { title: "Content Strategy", description: "Organized services, team info, and appointment booking into a clear information hierarchy." },
      { title: "Responsive Design", description: "Ensured the design worked seamlessly across desktop, tablet, and mobile devices." }
    ]),
    whatILearned: "Healthcare design demands a careful balance between clinical professionalism and warm, welcoming aesthetics to put patients at ease."
  },
  {
    id: "d7", title: "Educational Platform", order: 7,
    mainImage: "https://media.db.com/images/public/69d0e5e320893aed44df939b/3192ff462_generated_c0cd5ea5.png",
    heroBackground: "linear-gradient(135deg, #fd79a8, #e84393)",
    services: ["UI/UX Design", "Portal Design"], deliverables: ["Web Application"], status: "Completed",
    tagline: "Redesigning 66 pages to spark a 1,000-user surge in 1.5 months.",
    audience: "Students and educators in Norway using an online learning management system for coursework and collaboration.",
    challenges: "The existing system had poor UX leading to low engagement. A full redesign of 66+ pages needed to improve usability without disrupting existing workflows.",
    collaborativeInAction: "Closely collaborated with the in-house programming team to ensure designs were technically feasible and could be implemented within the project timeline.",
    whatIDid: JSON.stringify([
      { title: "UX Audit", description: "Conducted a thorough audit of all 66 pages, identifying usability issues and areas for improvement." },
      { title: "User Testing", description: "Ran usability tests with real students and teachers to validate redesign decisions." },
      { title: "Design System", description: "Built a scalable design system to ensure consistency across all pages and future updates." }
    ]),
    whatILearned: "A well-executed UX redesign can have a dramatic impact on user adoption — our redesign resulted in 1,000+ new users in just 1.5 months."
  },
  {
    id: "d8", title: "Restaurant Website", order: 8,
    mainImage: "https://media.db.com/images/public/69d0e5e320893aed44df939b/a8cc8b8f2_generated_cf7827ea.png",
    heroBackground: "linear-gradient(135deg, #e17055, #d63031)",
    services: ["Website Design", "Online Ordering"], deliverables: ["Website"], status: "Completed",
    tagline: "Bringing the restaurant experience online with mouth-watering design.",
    audience: "Restaurant customers looking to browse menus, place orders online, and make reservations.",
    challenges: "Food photography and warm visual design needed to make the online experience as appetizing as dining in person.",
    whatIDid: JSON.stringify([
      { title: "Visual Direction", description: "Established a warm, inviting visual language using photography, typography, and color." },
      { title: "Menu Design", description: "Designed an easy-to-browse digital menu with category filtering and dish highlights." },
      { title: "Order Flow", description: "Streamlined the online ordering process to minimize drop-offs and maximize conversions." }
    ]),
    whatILearned: "In food & beverage design, emotional appeal through visuals is paramount — beautiful food photography paired with the right typography can significantly boost online orders."
  },
];

export default function ProjectsSection({ initialProjectId }) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    db.entities.Project.list("order", 50).then(data => {
      const list = data.length > 0 ? data : DEFAULT_PROJECTS;
      setProjects(list);
      // If a project ID was passed via URL, open it
      if (initialProjectId) {
        const found = list.find(p => p.id === initialProjectId);
        if (found) setSelected(found);
      }
    });
  }, [initialProjectId]);

  function openProject(project) {
    setSelected(project);
    trackEvent("project_view", project.title);
    navigate(`/project/${project.id}`, { replace: true });
  }

  function closeProject() {
    setSelected(null);
    navigate("/", { replace: true });
  }

  const sorted = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="projects" className="py-16 sm:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sorted.map((project, i) => (
            <ProjectCard key={project.id || i} image={project.mainImage} index={i} onClick={() => openProject(project)} />
          ))}
        </div>
      </div>
      <ProjectSidePanel project={selected} onClose={closeProject} />
    </section>
  );
}