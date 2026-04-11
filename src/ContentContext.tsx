/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, query } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from './AuthContext';

interface ContentContextType {
  content: Record<string, string>;
  updateContent: (key: string, value: string, type: 'text' | 'image') => Promise<void>;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'contents'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newContent: Record<string, string> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        newContent[data.key] = data.value;
      });
      setContent(newContent);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'contents');
    });

    return () => unsubscribe();
  }, []);

  const updateContent = async (key: string, value: string, type: 'text' | 'image') => {
    if (!isAdmin) return;
    try {
      await setDoc(doc(db, 'contents', key), {
        key,
        value,
        type,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `contents/${key}`);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, isEditing, setIsEditing }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface EditableTextProps {
  contentKey: string;
  defaultText: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const EditableText: React.FC<EditableTextProps> = ({ contentKey, defaultText, className, as: Component = 'span' }) => {
  const { content, updateContent, isEditing } = useContent();
  const { isAdmin } = useAuth();
  const text = content[contentKey] || defaultText;

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.currentTarget.innerText;
    if (newValue !== text) {
      updateContent(contentKey, newValue, 'text');
    }
  };

  return (
    <div className="relative group inline-block w-full">
      <Component
        contentEditable={isEditing && isAdmin}
        onBlur={handleBlur}
        suppressContentEditableWarning
        className={`${className} ${isEditing && isAdmin ? 'outline-dashed outline-2 outline-blue-500 p-1 rounded cursor-text' : ''}`}
      >
        {text}
      </Component>
      {isAdmin && isEditing && (
        <div className="absolute -top-6 right-0 bg-blue-500 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Edit
        </div>
      )}
    </div>
  );
};
