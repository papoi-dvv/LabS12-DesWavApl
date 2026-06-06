'use client'

/* eslint-disable @next/next/no-img-element */

import Image, { ImageProps } from 'next/image'
import React, { useState } from 'react'

type Props = Omit<ImageProps, 'src'> & {
  src?: string | null
  kind?: 'book' | 'author'
}

export default function ImageWithFallback({ src, kind = 'book', alt = '', ...rest }: Props) {
  const [failed, setFailed] = useState(false)
  const fallback = kind === 'author' ? '/images/authors/placeholder.svg' : '/images/books/placeholder.svg'
  const effective = !src || failed ? fallback : src
  const isExternalOrData = effective.startsWith('http://') || effective.startsWith('https://') || effective.startsWith('data:')

  if (isExternalOrData) {
    const { fill, width, height, className, sizes } = rest
    const style = fill ? { position: 'absolute' as const, inset: 0, width: '100%', height: '100%' } : undefined

    return (
      <img
        src={effective}
        alt={alt}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        sizes={sizes}
        className={className}
        style={style}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <Image src={effective} alt={alt} onError={() => setFailed(true)} {...rest} />
  )
}
