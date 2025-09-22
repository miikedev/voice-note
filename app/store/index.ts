import { deleteNote } from '@/lib/notes';
import { getApiKey } from '@/lib/users';
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
  context?: string;
  audioUrl?: string;
  email?: string;
  editedText?: string;
  category?: string | null;
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

export const UserKeyAtom = atomWithQuery((get) => {
  const auth = get(authAtom);
  return {
    queryKey: ['user-key', auth?.user?.email],
    queryFn: async () => {
      if (!auth?.user?.email) {
        throw new Error("Email is not defined");
      }
      const res = await getApiKey(auth?.user?.email);

      return res;
    },

  }
})

export const useDeleteVoiceNote = () => {
  return useMutation({
    mutationFn: async ({ noteId, category }: { noteId: string; category: string }) => {
      const formData = new FormData();
      formData.append("noteId", noteId);

      const deleted = await deleteNote(formData);

      return { success: true, deleted, noteId, category };
    },
    onMutate: async ({ noteId, category }) => {
      console.log("onMutate fired ✅", { noteId, category });

      const cancledQuery = await queryClient.cancelQueries({ queryKey: ['voice-notes', category] });

      console.log('cancle query', cancledQuery)

      const previousNotes = queryClient.getQueryData<any>(["voice-notes", category]);

      console.log('prev notes', previousNotes)
      if (previousNotes) {
        queryClient.setQueryData(["voice-notes", category], (oldData: any) => ({
          ...oldData,
          data: oldData.data.filter((note: any) => note._id !== noteId),
        }));
      }

      return { previousNotes };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["voice-notes", variables.category], context.previousNotes);
      }
    },
    onSettled: (data, error, { category }) => {
      queryClient.invalidateQueries({ queryKey: ["voice-notes", category] });
    },
  });
};

export const youtubeTranscribeAtom = atomWithMutation(() => {
  return ({
    mutationKey: ['youtube-transcribe'],
    mutationFn: async ({ url, lang }: { url: string, lang: string }) => {

      console.log('data in mutation', url)

      const res = await fetch(`/api/transcribe-blob?url=${url}&lang=${lang}`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to save voice note');
      }

      const result = await res.json();

      console.log(result);

      // Access the readable stream
      // const reader = res.body?.getReader();
      // if (!reader) {
      //   throw new Error("ReadableStream not supported in this environment");
      // }

      // const chunks: Uint8Array[] = [];
      // let receivedLength = 0;

      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) break;

      //   if (value) {
      //     chunks.push(value);
      //     receivedLength += value.length;

      //     // Optionally show progress (if Content-Length is known)
      //     const total = Number(res.headers.get("Content-Length")) || 0;
      //     if (total) {
      //       const percentage = Math.round((receivedLength / total) * 100);
      //       console.log(`Progress: ${percentage}%`);
      //     }
      //   }
      // }

      // // Combine all chunks into a Blob
      // const blob = new Blob(chunks as BlobPart[]);
      // const blobUrl = URL.createObjectURL(blob);


      // console.log(blobUrl);

      return result.data;
    },
  })
})

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

export type mp3Data = {
  title?: string
  linkDownload?: string
  thumbnail?: string
}

export const youtubeToMp3Atom = atom<mp3Data>({ title: "", linkDownload: "", thumbnail: "" });

export const downloadMp3Atom = atomWithMutation(() => {
  return ({
    mutationKey: ['upload-url'],
    mutationFn: async ({ url, email }: { url: string, email: string }) => {
      console.log('data in mutation', url)
      const res = await fetch(`/api/youtube-to-mp3?url=${url}&email=${email}`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to save voice note');
      }

      const result = await res.json();
      return {
        title: result.data.title,
        linkDownload: result.data.linkDownload,
        thumbnail: result.data.thumbnailUrl
      };

    },
  })
});

export const useStreamMp3 = atomWithMutation(() => {
  return ({
    mutationKey: ['stream'],
    mutationFn: async ({ url, title }: { url: string, title: string }) => {
      console.log('data in mutation', url)

      const res = await fetch(`/api/stream-mp3?url=${url}&title=${title}`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error("Failed to download MP3");

      const blob = await res.blob();
      const downloadedUrl = URL.createObjectURL(blob);

      return {
        success: true,
        url: downloadedUrl,
        title
      };

    },
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