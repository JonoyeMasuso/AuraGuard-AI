import React from 'react';

// This is a placeholder for the ShareIcon. If you have a specific icon, replace this.
// This example uses a generic "share" icon from Heroicons.
export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 4.186m0-4.186c.524 1.104.994 2.243 1.381 3.427l-1.381-3.427zM14.25 10.907c-.524 1.104-.994 2.243-1.381 3.427l1.381-3.427zM3 10.907l1.381 3.427L3 10.907zm18 0l-1.381 3.427L21 10.907zM4.237 15.192l-1.381-3.427m1.381 3.427L6.02 12.75m-1.783 2.442l1.783-2.442M21 15.192l-1.381-3.427m1.381 3.427L17.98 12.75m1.783 2.442l-1.783-2.442M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);