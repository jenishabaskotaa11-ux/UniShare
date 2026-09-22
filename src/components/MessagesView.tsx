import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getFallbackAvatar, handleAvatarError } from '../utils/userHelpers.ts';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    messages,
    sendMessage,
    currentUser,
    setActiveTab,
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [searchConvQuery, setSearchConvQuery] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleQuickSend = (text: string) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, text);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchConvQuery.trim()) return true;
    const q = searchConvQuery.toLowerCase();
    return (
      c.peerName.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q) ||
      (c.peerProgram && c.peerProgram.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-surface rounded-3xl border border-surface-container-high shadow-xs overflow-hidden h-[78vh] flex flex-col md:flex-row">
      
      {/* Left Sidebar: Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-surface-container-high flex flex-col bg-surface-container-low ${activeConvId && 'hidden md:flex'}`}>
        
        {/* Search header */}
        <div className="p-4 border-b border-surface-container-high space-y-3 bg-surface shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Campus Messages</h2>
            <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary-container/20">
              Verified Peers Only
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchConvQuery}
              onChange={(e) => setSearchConvQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface-container-low text-xs border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-outline">
              search
            </span>
          </div>
        </div>

        {/* Conversations scroll area */}
        <div className="overflow-y-auto flex-1 divide-y divide-surface-container">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-outline">
              No conversations found
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = activeConv?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-surface border-l-4 border-primary'
                      : 'hover:bg-surface-container'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={c.peerAvatar || getFallbackAvatar(c.peerName)}
                      alt={c.peerName}
                      onError={(e) => handleAvatarError(e, c.peerName)}
                      className="w-11 h-11 rounded-full object-cover border border-surface-container bg-surface-container"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-secondary border-2 border-surface"></span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-on-surface truncate">
                        {c.peerName}
                      </h4>
                      <span className="text-[10px] text-outline shrink-0 ml-1">
                        {c.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-outline truncate mb-1">
                      {c.peerProgram}
                    </p>

                    <p className={`text-xs truncate ${c.unreadCount ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                      {c.lastMessage}
                    </p>

                    {c.relatedItem && (
                      <div className="mt-1.5 inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container text-[10px] text-primary truncate max-w-full">
                        <span className="material-symbols-outlined text-[12px] mr-1">handshake</span>
                        <span className="truncate">{c.relatedItem.name}</span>
                      </div>
                    )}
                  </div>

                  {Boolean(c.unreadCount) && (
                    <span className="w-4 h-4 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center shrink-0 self-center">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Area: Chat Stream */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-surface h-full min-w-0">
          
          {/* Top Bar: Peer Profile & Meetup Banner */}
          <div className="p-3 sm:p-4 border-b border-surface-container-high flex items-center justify-between bg-surface shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              {/* Back button on mobile */}
              <button
                onClick={() => setActiveConvId('')}
                className="md:hidden p-1.5 rounded-full text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeConv.peerAvatar || getFallbackAvatar(activeConv.peerName)}
                  alt={activeConv.peerName}
                  onError={(e) => handleAvatarError(e, activeConv.peerName)}
                  className="w-10 h-10 rounded-full object-cover border border-primary bg-surface-container"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-surface"></span>
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-sm text-on-surface truncate flex items-center">
                  {activeConv.peerName}
                  <span className="material-symbols-outlined text-[14px] text-secondary ml-1">verified</span>
                </h3>
                <p className="text-[11px] text-outline truncate">{activeConv.peerProgram}</p>
              </div>
            </div>

            {/* Hub Meetup Reminder */}
            {activeConv.relatedItem && (
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
                <div>
                  <span className="font-bold block text-[11px] leading-tight">
                    {activeConv.relatedItem.location || 'Central Library Hub'}
                  </span>
                  <span className="text-[10px] text-outline">
                    {activeConv.relatedItem.pickupTime || 'Tomorrow 10:00 AM'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Active Meetup Announcement Strip */}
          {activeConv.relatedItem?.pickupTime && (
            <div className="px-4 py-2 bg-primary-container/20 border-b border-primary/20 flex items-center justify-between text-xs text-on-surface shrink-0">
              <div className="flex items-center space-x-2 truncate">
                <span className="material-symbols-outlined text-[16px] text-primary shrink-0">event_available</span>
                <span className="truncate">
                  Handover: <strong>{activeConv.relatedItem.name}</strong> • {activeConv.relatedItem.pickupTime}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-primary hover:underline font-bold text-[11px] shrink-0 ml-2"
              >
                View Booking →
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-surface-container-lowest">
            <div className="text-center py-2">
              <span className="text-[10px] text-outline uppercase tracking-wider bg-surface px-3 py-1 rounded-full border border-surface-container">
                Encrypted Campus Handover Chat
              </span>
            </div>

            {activeMessages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id || msg.senderId === 'usr_riya';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-primary text-on-primary rounded-br-xs'
                        : 'bg-surface text-on-surface border border-surface-container-high rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-outline mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Response Chips */}
          <div className="px-4 py-2 border-t border-surface-container-high bg-surface flex items-center space-x-2 overflow-x-auto no-scrollbar shrink-0">
            {[
              "I'm heading to Central Library now!",
              "Are fresh batteries included?",
              "See you at the 1st floor desk!",
              "Thanks a lot, returning soon!"
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleQuickSend(chip)}
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-[11px] text-on-surface whitespace-nowrap border border-outline-variant transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 border-t border-surface-container-high bg-surface flex items-center space-x-2 shrink-0"
          >
            <input
              type="text"
              placeholder={`Message ${activeConv.peerName.split(' ')[0]}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-hover shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Send Message"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-outline">
          Select a conversation to start chatting.
        </div>
      )}

    </div>
  );
};
