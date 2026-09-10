import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Preloader } from './components/Preloader';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import About from './pages/About';
import WhatWeDo from './pages/WhatWeDo';
import Projects from './pages/Projects';
import Events from './pages/Events';
import Schools from './pages/Schools';
import Stories from './pages/Stories';
import Gallery from './pages/Gallery';
import People from './pages/People';
import Partners from './pages/Partners';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';

// Admin
import { AdminProvider } from './admin/AdminContext';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminEvents from './admin/AdminEvents';
import AdminGallery from './admin/AdminGallery';
import AdminStories from './admin/AdminStories';
import AdminPeople from './admin/AdminPeople';
import AdminPartners from './admin/AdminPartners';
import AdminSettings from './admin/AdminSettings';

function AppRoutes() {
  const location = useLocation();
  return (
    <>
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/events" element={<Events />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/people" element={<People />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

function AdminRoutes() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/stories" element={<AdminStories />} />
          <Route path="/admin/people" element={<AdminPeople />} />
          <Route path="/admin/partners" element={<AdminPartners />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AdminProvider>
  );
}

function RootRouter() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollToTop />
      {isAdmin ? <AdminRoutes /> : <SmoothScroll><AppRoutes /></SmoothScroll>}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <RootRouter />
    </BrowserRouter>
  );
}
