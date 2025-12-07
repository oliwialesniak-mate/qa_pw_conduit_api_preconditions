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

  // Must use registeredUser (not loggedInUserAndPage) so the test performs a real UI login from a logged-out state.
  // page fixture starts with no active session.

  const newPassword = factories.user.generatePassword();

  const updatedUser = { ...registeredUser, password: newPassword };

  const updateResponse = await usersApi.updateUser(updatedUser);
  expect(updateResponse.ok()).toBeTruthy();

  await signInPage.open();
  await signInPage.fillEmailField(registeredUser.email);
  await signInPage.fillPasswordField(newPassword);
  await signInPage.clickSignInButton();

  await internalHomePage.yourFeed.assertTabLinkVisible();
});
