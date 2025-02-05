import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside style={{ width: '250px', padding: '20px', background: '#f4f4f4' }}>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/subscriptions">Subscriptions</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/create-post">Create Post</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
