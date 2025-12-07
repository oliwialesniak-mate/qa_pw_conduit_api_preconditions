import { test } from '../../_fixtures/fixtures';
import { ExternalViewArticlePage } from '../../../src/ui/pages/article/view/ExternalViewArticlePage';
import { expect } from '@playwright/test';

test.use({ contextsNumber: 2, usersNumber: 1 });

test.beforeEach(
  async ({ articlesApi, registeredUser, articleWithoutTags }) => {
    const articlePayload = {
      title: articleWithoutTags.title,
      description: articleWithoutTags.description ?? 'Test article description',
      body: articleWithoutTags.text,
      tagList: [],
    };

    const response = await articlesApi.createArticle(
      articlePayload,
      registeredUser.token,
    );

    expect(response.ok()).toBeTruthy();

    const slug = await articlesApi.parseSlugFromResponse(response);

    articleWithoutTags.url = `/article/${slug}`;
  },
);

test('View an article as not registered user', async ({
  articleWithoutTags,
  pages,
  registeredUser,
}) => {
  const viewArticlePage = new ExternalViewArticlePage(pages[1], 2);

  await viewArticlePage.open(articleWithoutTags.url);

  await viewArticlePage.articleHeader.assertTitleIsVisible(
    articleWithoutTags.title,
  );
  await viewArticlePage.articleContent.assertArticleTextIsVisible(
    articleWithoutTags.text,
  );
  await viewArticlePage.articleHeader.assertAuthorNameIsVisible(
    registeredUser.username,
  );
});