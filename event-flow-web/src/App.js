import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import ParticipantDashboard from './pages/ParticipantDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import Profile from './pages/Profile';
import OrganizerProfile from './pages/OrganizerProfile';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import ParticipantEvents from './pages/ParticipantEvents';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import EventDetails from './pages/EventDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/participant/profile" element={<Profile />} />
        <Route path="/organizer/profile" element={<OrganizerProfile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/participant/events" element={<ParticipantEvents />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/organizer/events" element={<MyEvents />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/events/:id" element={<EventDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;