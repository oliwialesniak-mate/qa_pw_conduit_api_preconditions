import { test, expect } from '../../_fixtures/fixtures';
import { INVALID_EMAIL_OR_PASSWORD_MESSAGE } from '../../../src/ui/constants/authErrorMessages';
import { SignInPage } from '../../../src/ui/pages/auth/SignInPage';

test('Login with old password after it was updated via API', async ({
  page,
  registeredUser,
  factories,
  usersApi,
}) => {
  const signInPage = new SignInPage(page);

  // Using registeredUser intentionally because this test must sign in via the UI from a logged-out state.
  // loggedInUserAndPage would already have an active session.
  // page fixture guarantees user starts fully logged out.

  const newPassword = factories.user.generatePassword();

  const updatedUser = { ...registeredUser, password: newPassword };

  const updateResponse = await usersApi.updateUser(updatedUser);
  expect(updateResponse.ok()).toBeTruthy(); // required API assertion

  await signInPage.open();
  await signInPage.fillEmailField(registeredUser.email);
  await signInPage.fillPasswordField(registeredUser.password);
  await signInPage.clickSignInButton();

  await signInPage.assertErrorMessageContainsText(
    INVALID_EMAIL_OR_PASSWORD_MESSAGE,
  );
});
