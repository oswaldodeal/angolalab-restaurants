'use client';

import { useState } from 'react';

export default function StaffPhotoInput() {
  const [tooLarge, setTooLarge] = useState(false);
  return (
    <>
      <input
        type="file"
        name="photoFile"
        accept="image/jpeg,image/png,image/webp"
        className="mt-1 block w-full"
        onChange={({ currentTarget }) => {
          const oversized = (currentTarget.files?.[0]?.size ?? 0) > 250 * 1024;
          if (oversized) currentTarget.value = '';
          currentTarget.setCustomValidity(oversized ? 'Choose an image up to 250 KB. / Escolha uma imagem até 250 KB.' : '');
          setTooLarge(oversized);
        }}
      />
      {tooLarge && <span role="alert" className="block text-sm text-red-700">Image too large. Choose a file up to 250 KB. / Imagem demasiado grande. Escolha um ficheiro até 250 KB.</span>}
    </>
  );
}
