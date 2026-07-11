import { composers, type composerSlug } from './composers';
import { concerts, type concertSlug } from './concerts';
import { getFullTitle, getPublishedPostMetadata } from './index';

export type ConcertDirectoryPost = {
  slug: string;
  title: string;
  composerName?: string;
};

export type ConcertDirectoryGroup = {
  slug: concertSlug;
  title: string;
  date: string;
  url: string;
  flyer: string;
  posts: ConcertDirectoryPost[];
};

export type ComposerDirectoryPost = {
  slug: string;
  title: string;
  concertTitle: string;
};

export type ComposerDirectoryGroup = {
  slug: composerSlug;
  shortName: string;
  fullName: string;
  yearOfBirth: number;
  yearOfDeath?: number;
  posts: ComposerDirectoryPost[];
};

/** Published program notes grouped by their source concert, newest concert first. */
export const getConcertDirectoryGroups = (): ConcertDirectoryGroup[] => {
  const publishedPosts = getPublishedPostMetadata();

  return (Object.entries(concerts) as [concertSlug, (typeof concerts)[concertSlug]][])
    .map(([slug, concert]) => ({
      slug,
      title: concert.title,
      date: concert.date,
      url: concert.url,
      flyer: concert.flyer,
      posts: publishedPosts
        .filter((post) => post.metadata.concertSlug === slug)
        .map((post) => ({
          slug: post.slug,
          title: getFullTitle(post),
          composerName: post.metadata.composerSlug
            ? composers[post.metadata.composerSlug].shortName
            : undefined
        }))
    }))
    .filter((concert) => concert.posts.length > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/** Published program notes grouped by composer, ordered by Japanese display name. */
export const getComposerDirectoryGroups = (): ComposerDirectoryGroup[] => {
  const publishedPosts = getPublishedPostMetadata();

  return (Object.entries(composers) as [composerSlug, (typeof composers)[composerSlug]][])
    .map(([slug, composer]) => ({
      slug,
      shortName: composer.shortName,
      fullName: composer.fullName,
      yearOfBirth: composer.yearOfBirth,
      ...('yearOfDeath' in composer ? { yearOfDeath: composer.yearOfDeath } : {}),
      posts: publishedPosts
        .filter((post) => post.metadata.tags.includes(composer.shortName))
        .map((post) => ({
          slug: post.slug,
          title: post.metadata.title,
          concertTitle: concerts[post.metadata.concertSlug].title
        }))
    }))
    .filter((composer) => composer.posts.length > 0)
    .sort((a, b) => a.shortName.localeCompare(b.shortName, 'ja'));
};
