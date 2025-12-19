import {useEffect} from 'react'
import {useChatStore} from '../store/useChatStore'
import {useAuthStore} from '../store/useAuthStore'
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';

function ChatContainer() {
  const {selectedUser,getMessagesByUserId,messages} = useChatStore();
  const {authUser} = useAuthStore();
  useEffect(()=>{
    getMessagesByUserId(selectedUser._id);
  },[selectedUser,getMessagesByUserId])
  return (
    <>
    <ChatHeader/>
    <div className='flex-1 px-6 overflow-y-auto py-8'>
    {messages.length > 0 ? (
      <p>Some Messages</p>
    ) : (
      <NoChatHistoryPlaceholder name={selectedUser.fullName}/>
    )}
    </div>
    </>
  )
}

export default ChatContainer
