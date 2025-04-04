'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from '@/components/toast';
import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';
import { login, type LoginActionState } from '../actions';
import { SentimentDetector } from '@/lib/sentiment-detector';
import { DocumentHandler, DocumentType } from '@/lib/document-handler';
import GitaBackground from '@/components/GitaBackground';

// Initialize the sentiment detector
const sentimentDetector = new SentimentDetector();

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [sentimentResponse, setSentimentResponse] = useState<string>('');

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast({
        type: 'error',
        description: 'Invalid credentials!',
      });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    const emailValue = formData.get('email') as string;
    setEmail(emailValue);
    
    // Check for sentiment in any notes/comments field
    const notes = formData.get('notes') as string;
    if (notes) {
      detectSentiment(notes);
    }
    
    formAction(formData);
  };
  
  // Sentiment detection function
  const detectSentiment = (text: string) => {
    const result = sentimentDetector.analyze(text);
    setSentimentResponse(result.response);
  };
  
  // Function to handle document download
  const handleDownloadDocument = (docType: DocumentType) => {
    toast({
      type: 'success',
      description: `Downloading ${docType} document...`,
    });
    
    // Use the DocumentHandler to manage downloads
    DocumentHandler.downloadDocument(docType);
  };

  return (
    <GitaBackground changeInterval={30000}>
      <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-8 shadow-xl">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-2xl font-semibold dark:text-zinc-50">
              Begin Your Journey
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Enter your credentials with mindfulness and purpose
            </p>
          </div>
          
          <AuthForm action={handleSubmit} defaultEmail={email}>
            {/* Additional field for sentiment detection */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                How are you feeling today? (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                placeholder="Share your thoughts or concerns..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onBlur={(e) => detectSentiment(e.target.value)}
              />
            </div>
            
            {sentimentResponse && (
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-sm text-blue-700 dark:text-blue-200">
                {sentimentResponse}
              </div>
            )}
            
            <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
            
            <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                Sign up
              </Link>
              {' for free.'}
            </p>
            
            {/* Document download section */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Download Resources
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button" // Important to prevent form submission
                  onClick={() => handleDownloadDocument('Guide')}
                  className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 transition-colors"
                >
                  User Guide
                </button>
                <button
                  type="button" // Important to prevent form submission
                  onClick={() => handleDownloadDocument('Terms')}
                  className="px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 transition-colors"
                >
                  Terms & Conditions
                </button>
                <button
                  type="button" // Important to prevent form submission
                  onClick={() => handleDownloadDocument('Privacy')}
                  className="px-3 py-1 text-xs rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 transition-colors"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </AuthForm>
        </div>
      </div>
    </GitaBackground>
  );
}