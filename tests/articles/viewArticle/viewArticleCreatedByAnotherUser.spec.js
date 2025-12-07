import { test, expect } from '../../_fixtures/fixtures';
import { InternalViewArticlePage } from '../../../src/ui/pages/article/view/InternalViewArticlePage';
import { generateStorageStateForAuth } from '../../../src/common/helpers/generateStorageStateForAuth';

test.use({ usersNumber: 2 });

test.beforeEach(async ({
  articlesApi,
  registeredUsers,
  articleWithoutTags,
}) => {
  const author = registeredUsers[0];

  const articlePayload = {
    title: articleWithoutTags.title,
    description: articleWithoutTags.description ?? 'Article created via API',
    body: articleWithoutTags.text,
    tagList: [],
  };

  const response = await articlesApi.createArticle(
    articlePayload,
    author.token,
  );

  expect(response.status()).toBe(200);

  const slug = await articlesApi.parseSlugFromResponse(response);
  articleWithoutTags.url = `/article/${slug}`;
});

test('View an article created by another registered user', async ({
  browser,
  registeredUsers,
  articleWithoutTags,
}) => {
  const author = registeredUsers[0];
  const viewer = registeredUsers[1];

  // generateStorageStateForAuth MAY be async → we await it safely.
  const viewerStorage = await generateStorageStateForAuth(viewer);

  // Correct logic: If helper already returns { storageState: ... } keep it.
  // Otherwise wrap raw cookie JSON as { storageState: <json> }
  const contextOptions =
    viewerStorage && typeof viewerStorage === 'object' && 'storageState' in viewerStorage
      ? viewerStorage
      : { storageState: viewerStorage };

  const viewerContext = await browser.newContext(contextOptions);
  const viewerPage = await viewerContext.newPage();

  const page = new InternalViewArticlePage(viewerPage, 2);
  await page.open(articleWithoutTags.url);

  await page.articleHeader.assertTitleIsVisible(articleWithoutTags.title);
  await page.articleContent.assertArticleTextIsVisible(articleWithoutTags.text);
  await page.articleHeader.assertAuthorNameIsVisible(author.username);

  // Prevent leaking browser contexts in CI
  await viewerContext.close();
});
