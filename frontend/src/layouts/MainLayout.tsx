import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* Вместо <Routes>, чтобы рендерить вложенные маршруты */}
      </main>
    </div>
  );
};

export default MainLayout;
