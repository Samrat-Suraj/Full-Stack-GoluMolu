import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginSignUpPage from './pages/LoginSignUpPage'
import ProfilePage from './pages/ProfilePage'
import Favorites from './pages/Favorites'
import NotficationsPage from './pages/NotficationsPage'
import SettingsPage from './pages/SettingsPage'
import MessagesPages from './pages/MessagesPages'
import PostDetailsPages from './pages/PostDetailsPages'
import PageNotFoundPage from './pages/PageNotFoundPage'
import SuggestedUserPage from './pages/SuggestedUserPage'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUser } from './redux/chatSlice'
import { io } from 'socket.io-client'
import SearchPage from './pages/SearchPage'
import ProtectRoutes from './components/component/ProtectRoutes'

const App = () => {

  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:5000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      socketio.on("GetUserOnline", (onlineUser) => {
        dispatch(setOnlineUser(onlineUser));
      });


      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    }

    if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <div className='bg-gray-100 app'>
      <Routes>
        <Route path='/' element={<ProtectRoutes><HomePage /></ProtectRoutes>} ></Route>
        <Route path='/auth' element={<ProtectRoutes> <LoginSignUpPage /></ProtectRoutes>} ></Route>
        <Route path='/profile/:id' element={<ProtectRoutes><ProfilePage /></ProtectRoutes>} ></Route>
        <Route path='/favorites' element={<ProtectRoutes><Favorites /></ProtectRoutes>} ></Route>
        <Route path='/notification' element={<ProtectRoutes><NotficationsPage /></ProtectRoutes>} ></Route>
        <Route path='/setting' element={<ProtectRoutes><SettingsPage /></ProtectRoutes>} ></Route>
        <Route path='/message' element={<ProtectRoutes><MessagesPages /></ProtectRoutes>} ></Route>
        <Route path='/post/:id' element={<ProtectRoutes><PostDetailsPages /></ProtectRoutes>} ></Route>
        <Route path='/suggested' element={<ProtectRoutes><SuggestedUserPage /></ProtectRoutes>} ></Route>
        <Route path='*' element={<PageNotFoundPage />} ></Route>
        <Route path='/search' element={<ProtectRoutes><SearchPage /></ProtectRoutes>} ></Route>
      </Routes>
    </div>
  )
}

export default App