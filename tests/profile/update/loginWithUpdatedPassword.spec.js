import { test, expect } from '../../_fixtures/fixtures';
import { InternalHomePage } from '../../../src/ui/pages/home/InternalHomePage';
import { SignInPage } from '../../../src/ui/pages/auth/SignInPage';

test('Login with new password after it was updated via API', async ({
  page,
  registeredUser,
  factories,
  usersApi,
}) => {
  const signInPage = new SignInPage(page);
  const internalHomePage = new InternalHomePage(page);

  // Must start logged out and log in via UI → therefore we use registeredUser.
  // registeredUser is created via API (fixture requirement).

  const newPassword = factories.user.generatePassword();
  const updatedUser = { ...registeredUser, password: newPassword };

  const response = await usersApi.updateUser(updatedUser, registeredUser.token);
  expect(response.status()).toBe(200);

  await signInPage.open();
  await signInPage.assertFormVisible();

  await signInPage.fillEmailField(registeredUser.email);
  await signInPage.fillPasswordField(newPassword);
  await signInPage.clickSignInButton();

  await internalHomePage.yourFeed.assertTabLinkVisible();
});
