import { test } from '../../_fixtures/fixtures';
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

  const newPassword = factories.user.generatePassword();

  const updatedUser = { ...registeredUser, password: newPassword };
  await usersApi.updateUser(updatedUser);

  await signInPage.open();
  await signInPage.fillEmailField(registeredUser.email);
  await signInPage.fillPasswordField(newPassword);
  await signInPage.clickSignInButton();

  await internalHomePage.yourFeed.assertTabLinkVisible();
});