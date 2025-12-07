import { test } from '../../_fixtures/fixtures';
import { INVALID_EMAIL_OR_PASSWORD_MESSAGE } from '../../../src/ui/constants/authErrorMessages';
import { SignInPage } from '../../../src/ui/pages/auth/SignInPage';

test('Login with old password after it was updated via API', async ({
  page,
  registeredUser,
  factories,
  usersApi,
}) => {
  const signInPage = new SignInPage(page);

  const newPassword = factories.user.generatePassword();

  const updatedUser = { ...registeredUser, password: newPassword };
  await usersApi.updateUser(updatedUser);

  await signInPage.open();
  await signInPage.fillEmailField(registeredUser.email);
  await signInPage.fillPasswordField(registeredUser.password);
  await signInPage.clickSignInButton();

  await signInPage.assertErrorMessageContainsText(
    INVALID_EMAIL_OR_PASSWORD_MESSAGE,
  );
});