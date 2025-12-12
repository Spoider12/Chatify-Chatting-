

import { useEffect } from 'react'
import ActiveTabSwitch from '../components/ActiveTabSwitch'
import BorderAnimatedContainer from '../components/BorderAnimatedContainer'
import ChatsList from '../components/ChatsList'
import ProfileHeader from '../components/ProfileHeader'
import {useChatStore} from '../store/useChatStore'
import ContactsList from '../components/ContactsList'
import ChatContainer from '../components/ChatContainer'
import NoConversationPlaceholder from '../components/NoConversationPlaceholder'

function ChatPage() {
  const {activeTab, selectedUser, getMyChatPartners, getAllContacts} = useChatStore()
  
  useEffect(() => {
    // Load chats and contacts when page mounts
    getMyChatPartners();
    getAllContacts();
  }, [getMyChatPartners, getAllContacts]);
  
  return (
    <div className='relative w-full max-w-6xl h-[800px]'>
     <BorderAnimatedContainer>
      {/*left side chat lsit */}
      <div className='w-80 bg-slate-700/50 backdrop-blur-sm flex flex-col'>
      <ProfileHeader/>
      <ActiveTabSwitch/>
      <div className='flex-1 overflow-y-auto p-4 space-y-2'>
        {activeTab ==="chats"?<ChatsList/>:<ContactsList/> }

      </div>
      </div>
      {/*right side chat area */}
      <div className='flex-1 bg-slate-700/50 backdrop-blur-sm'>
      {selectedUser ? <ChatContainer/>:<NoConversationPlaceholder/>}
      </div>
     </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage
