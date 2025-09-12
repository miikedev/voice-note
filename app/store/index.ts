import { deleteNote } from '@/lib/notes';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai'
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { ObjectId } from 'mongodb';
import { ISODateString } from 'next-auth';
import { toast } from 'sonner'

// Define the User type
interface User {
  name: string | undefined | null;
  email: string | undefined | null;
  image: string | undefined | null;
}

// Define the Auth type
export interface Auth {
  user?: User;
  expires: ISODateString; // Date is typically represented as a string in ISO format
}

const authContent: Auth = {
  user: {
    name: "",
    email: "",
    image: "",
  },
  expires: "",
};

// toggle atom for data descending and ascending
const toggleAtom = atom(false);

const apiKeyAtom = atom<string>("");

const selectedLanguageAtom = atom<string | undefined>(undefined);
const selectedDurationAtom = atom<string | undefined>(undefined);

export interface TranscribedData {
  _id?: string | ObjectId | undefined;
  transcribedText: string;
  english: string;
  context: string;
  audioUrl: string;
  email: string;
  editedText?: string;
  category: string | null;
}

const transcribedContent = {
  transcribedText: "",
  english: "",
  context: "",
  editedText: "",
  category: "",
  audioUrl: "",
  email: ""
}

const submittedContent = {
  english: "",
  context: "",
  audioUrl: "",
  email: "",
  transcribedText: "",
  category: "",
  lang: "",
  duration: null,
}

export type SubmittedNoteData = {
  _id?: string;
  english: string;
  audioUrl: string;
  email: string;
  transcribedText?: string | null;
  category: string | null;
  lang: string;
  duration: number | null;
}

const transcribed_storage = createJSONStorage<TranscribedData>(
  // getStringStorage
  () => sessionStorage, // or sessionStorage, asyncStorage or alike
  // // options (optional)
  // {
  //   reviver, // optional reviver option for JSON.parse
  //   replacer, // optional replacer option for JSON.stringify
  // },
)

const submitted_storage = createJSONStorage<SubmittedNoteData>(
  () => sessionStorage,
)

const auth_storage = createJSONStorage<Auth>(
  () => localStorage,
)

const authAtom = atomWithStorage<Auth>('user-email', authContent, auth_storage)
const transcribedAtom = atomWithStorage<TranscribedData>('transcribed-data', transcribedContent, transcribed_storage)
const selectedCategoryAtom = atom<string>(""); // Initialize with null or a default value
const submittedDataAtom = atomWithStorage<SubmittedNoteData>('submitted-data', submittedContent, submitted_storage) // Initialize with null or a default value

export const queryClient = new QueryClient();

const voiceNoteAtom = atomWithQuery((get) => {
  const auth = get(authAtom);
  const category = get(selectedCategoryAtom);
  const isDescending = get(toggleAtom); // Get the toggle state for sorting

  console.log('email in voiceNoteAtom:', auth);
  console.log('Fetching with email:', auth?.user?.email, 'and category:', category, 'Descending:', isDescending); // Debug output
  console.log('selected category', category)
  return {
    queryKey: ['voice-notes', category], // Add isDescending to queryKey
    queryFn: async () => {
      if (!auth?.user?.email) {
        throw new Error("Email is not defined");
      }
      // You might want to make additional changes on the server side to handle sort order
      const res = await fetch(`/api/notes?email=${auth?.user?.email}&category=${category}&order=${isDescending ? 'desc' : 'asc'}`); // Pass sort order as query param 

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }
      return res.json();
    },
  };
});

export const DeleteVoiceNoteAtom = () => {
  return useMutation({
    mutationKey: ['voice-notes'],
    mutationFn: async ({ noteId, category }: { noteId: string, category: string }) => {
      console.log('data in mutation', noteId)
      const formData = new FormData();
      formData.append('noteId', noteId)
      // }
      const deleted = await deleteNote(formData)
      // const result = await res.json();
      return { success: true, deleted };
    },
    onMutate: async ({ category }) => {
      console.log('category in on mutate', category);
      await queryClient.cancelQueries(["voice-notes", category]);

      // Snapshot the previous value
      const previousNotes = queryClient.getQueryData(["voice-notes", category]);

      // Optimistically update to the new value
      if (previousNotes) {
        queryClient.setQueryData(["voice-notes", category], (oldData) => {
          console.log('old data', oldData)
          return {
            ...oldData,
            data: oldData.data.filter((note) => note._id !== id),
          }
        });
      }

      // Return a context object with the snapshotted value
      return { previousNotes };
    },
    onSettled: ({ category }) => queryClient.invalidateQueries({ queryKey: ['voice-notes', category] }),
  })
}

const mutateVoiceNoteAtom = atomWithMutation(() => {
  return ({
    mutationKey: ['voice-notes'],
    mutationFn: async ({ data }: { data: SubmittedNoteData }) => {
      console.log('data in mutation', data)
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Ensure finalData is the data you're sending
      });

      if (!res.ok) {
        throw new Error('Failed to save voice note');
      }

      const result = await res.json();
      return result;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['voice-notes'] }),

  })
});



export const submitDataAtom = atom(async (get) => {
  const transcribedData = get(transcribedAtom);
  const selectedCategory = get(selectedCategoryAtom);


  if (!transcribedData || !selectedCategory) {
    toast.warning("Cannot submit data without transcribed data and category.");
    return;
  }

  const response = await fetch('/api/voice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...transcribedData,
      category: selectedCategory,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save data');
  }

  const data = await response.json();
  return {
    ...transcribedData,
    category: selectedCategory,
    ...data,
  };
});

const usersAtom = atomWithQuery(() => {
  return ({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/users');

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }
      return res.json();
    },
  })
})


export { useAtom, voiceNoteAtom, selectedDurationAtom, selectedLanguageAtom, transcribedAtom, selectedCategoryAtom, submittedDataAtom, mutateVoiceNoteAtom, authAtom, toggleAtom, apiKeyAtom, usersAtom }