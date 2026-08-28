import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export const ChatModal: React.FC = () => {
  const {
    chatModalVisible,
    closeChat,
    activeChatId,
    chats,
    sendMessage,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');

  if (!chatModalVisible || !activeChatId) return null;

  const currentChat = chats.find((c) => c.id === activeChatId) || chats[0];
  if (!currentChat) return null;

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    const txt = inputMessage.trim();
    setInputMessage('');
    sendMessage(currentChat.id, txt);
  };

  return (
    <Modal visible={chatModalVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.proInfoRow}>
              <Image source={{ uri: currentChat.professionalAvatar }} style={styles.proAvatar} />
              <View>
                <ThemedText style={styles.proName}>{currentChat.professionalName}</ThemedText>
                <ThemedText style={styles.proStatus}>
                  {currentChat.online ? 'Online now' : 'Offline'} • {currentChat.professionalProfession}
                </ThemedText>
              </View>
            </View>

            <Pressable onPress={closeChat} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Palette.dark} />
            </Pressable>
          </View>

          {/* Messages Stream */}
          <ScrollView
            style={styles.messagesStream}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}>
            {currentChat.messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubbleWrap,
                  msg.isMe ? styles.messageMeWrap : styles.messageProWrap,
                ]}>
                <View
                  style={[
                    styles.messageBubble,
                    msg.isMe ? styles.messageMeBubble : styles.messageProBubble,
                  ]}>
                  <ThemedText
                    style={[
                      styles.messageText,
                      msg.isMe ? styles.messageMeText : styles.messageProText,
                    ]}>
                    {msg.text}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.messageTime,
                      msg.isMe ? styles.messageMeTime : styles.messageProTime,
                    ]}>
                    {msg.timestamp}
                  </ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.inputFlex}
              placeholder="Type your message..."
              placeholderTextColor={Palette.secondaryText}
              value={inputMessage}
              onChangeText={setInputMessage}
              onSubmitEditing={handleSend}
            />

            <Pressable onPress={handleSend} style={styles.sendBtn}>
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 48, 74, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Palette.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '92%',
    minHeight: '75%',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  proInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  proAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  proName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
  },
  proStatus: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesStream: {
    flex: 1,
    padding: Spacing.lg,
  },
  messagesContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  messageBubbleWrap: {
    width: '100%',
    flexDirection: 'row',
  },
  messageMeWrap: {
    justifyContent: 'flex-end',
  },
  messageProWrap: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.default,
    gap: 4,
  },
  messageMeBubble: {
    backgroundColor: Palette.primary,
    borderBottomRightRadius: 2,
  },
  messageProBubble: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageMeText: {
    color: '#FFFFFF',
  },
  messageProText: {
    color: Palette.dark,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  messageMeTime: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  messageProTime: {
    color: Palette.secondaryText,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  inputFlex: {
    flex: 1,
    height: 44,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    color: Palette.mainText,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
