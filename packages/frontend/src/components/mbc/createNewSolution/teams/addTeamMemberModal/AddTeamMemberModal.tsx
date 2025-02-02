import cn from 'classnames';
import * as React from 'react';
// @ts-ignore
import ProgressIndicator from '../../../../../assets/modules/uilab/js/src/progress-indicator';
import { TeamMemberType } from '../../../../../globals/Enums';
import { ITeams } from '../../../../../globals/types';
import { ApiClient } from '../../../../../services/ApiClient';
// @ts-ignore
import InputFieldsUtils from '../../../../formElements/InputFields/InputFieldsUtils';
import { Modal } from '../../../../formElements/modal/Modal';
import Styles from './AddTeamMemberModal.scss';
import { Envs } from '../../../../../globals/Envs';
import * as Validation from '../../../../../utils/Validation';

const classNames = cn.bind(Styles);

export interface IAddTeamMemberModalProps {
  modalTitleText?: string;
  editMode: boolean;
  showAddTeamMemberModal: boolean;
  teamMember: ITeams;
  showOnlyInteral?: boolean;
  onAddTeamMemberModalCancel: () => void;
  onUpdateTeamMemberList: (teamMemberObj: ITeams) => void;
}

export interface IAddTeamMemberModalState {
  belongingInternal: boolean;
  teamPositionInternal: string;
  teamPositionInternalError: string;
  userIdInternal: string;
  userIdInternalError: string;
  companyExternal: string;
  companyExternalError: string;
  teamPositionExternal: string;
  teamPositionExternalError: string;
  teamMemberObj: ITeams;
  showNotFoundError: boolean;
  teamMemberError: string;
  firstName: string;
  firstNameError: string;
  lastName: string;
  lastNameError: string;
  mobileNumber: string;
  mobileNumberError: string;
  email: string;
  emailError: string;
  company: string;
  companyError: string;
  department: string;
  departmentError: string;
  shortID: string;
  shortIDError: string;
  teamPosition: string;
  teamPositionError: string;
  isEmailValid: boolean;
}

export default class AddTeamMemberModal extends React.Component<IAddTeamMemberModalProps, IAddTeamMemberModalState> {
  constructor(props: any) {
    super(props);
    this.state = {
      belongingInternal: true,
      teamPositionInternal: '',
      teamPositionInternalError: null,
      userIdInternal: '',
      userIdInternalError: null,
      companyExternal: '',
      companyExternalError: null,
      teamPositionExternal: '',
      teamPositionExternalError: null,
      teamMemberObj: this.props.teamMember,
      showNotFoundError: false,
      teamMemberError: null,
      firstName: '',
      firstNameError: null,
      lastName: '',
      lastNameError: null,
      mobileNumber: '',
      mobileNumberError: null,
      email: '',
      emailError: null,
      company: '',
      companyError: null,
      department: '',
      departmentError: null,
      shortID: '',
      shortIDError: null,
      teamPosition: '',
      teamPositionError: null,
      isEmailValid: true,
    };
    this.validateMobile = this.validateMobile.bind(this);
    this.validateEmailID = this.validateEmailID.bind(this);
  }

  public render() {
    const requiredError = '*Missing entry';
    const teamPositionInternalError = this.state.teamPositionInternalError || '';
    const userIdInternalError = this.state.userIdInternalError || '';
    const companyExternalError = this.state.companyExternalError || '';
    const teamPositionExternalError = this.state.teamPositionExternalError || '';

    const firstNameError = this.state.firstNameError || '';
    const lastNameError = this.state.lastNameError || '';
    const mobileNumberError = this.state.mobileNumberError || '';
    const emailError = this.state.emailError || '';
    const companyError = this.state.companyError || '';
    const departmentError = this.state.departmentError || '';
    const shortIDError = this.state.shortIDError || '';
    const teamPositionError = this.state.teamPositionError || '';

    const {
      belongingInternal,
      userIdInternal,
      teamPositionInternal,
      teamPositionExternal,
      companyExternal,
      teamMemberObj,
      firstName,
      lastName,
      mobileNumber,
      email,
      company,
      department,
      shortID,
      teamPosition,
    } = this.state;

    const addTeamMemberModalContent: React.ReactNode = (
      <div id="teamsModalDiv" className={classNames(Styles.firstPanel, Styles.addTeamMemberModal)}>
        <div className={Styles.formWrapper}>
          {this.props.showOnlyInteral ? (
            ''
          ) : (
            <div className="input-field-group">
              <label htmlFor="usr" className="input-label">
                Belonging<sup>*</sup>
              </label>
              <div>
                <label className={classNames('radio', this.props.editMode ? 'disabled' : '')}>
                  <span className="wrapper">
                    <input
                      type="radio"
                      value="Internal"
                      name="belonging"
                      onChange={this.onBelongingChange}
                      checked={belongingInternal}
                      disabled={this.props.editMode}
                    />
                  </span>
                  <span className="label">Internal (Daimler Login)</span>
                </label>
                <label className={classNames('radio', this.props.editMode ? 'disabled' : '')}>
                  <span className="wrapper">
                    <input
                      type="radio"
                      value="External"
                      name="belonging"
                      onChange={this.onBelongingChange}
                      checked={!belongingInternal}
                      disabled={this.props.editMode}
                    />
                  </span>
                  <span className="label">External</span>
                </label>
              </div>
            </div>
          )}
          <div className={belongingInternal ? Styles.internalWrapper : 'hide'}>
            <div
              className={classNames('input-field-group include-error', teamPositionInternalError.length ? 'error' : '')}
            >
              <label htmlFor="teamPositionInternal" className="input-label">
                Team Position (e.g. IT)<sup>*</sup>
              </label>
              <input
                type="text"
                className="input-field"
                required={true}
                required-error={requiredError}
                id="teamPositionInternal"
                name="teamPositionInternal"
                placeholder="Type here"
                autoComplete="off"
                value={teamPositionInternal}
                maxLength={200}
                onChange={this.textInputOnChange}
              />
              <span className={classNames('error-message', teamPositionInternalError.length ? '' : 'hide')}>
                {teamPositionInternalError}
              </span>
            </div>
            <div>
              <div className={classNames(Styles.flexLayout, Styles.searchWrapper)}>
                <div
                  className={classNames('input-field-group include-error', userIdInternalError.length ? 'error' : '')}
                >
                  <label htmlFor="userIdInternal" className="input-label">
                    User-ID<sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    id="userIdInternal"
                    name="userIdInternal"
                    placeholder="Type here"
                    autoComplete="off"
                    value={userIdInternal}
                    maxLength={100}
                    onKeyDown={this.onSearchKeyDown}
                    onChange={this.textInputOnChange}
                  />
                  <span className={Styles.clearSearch} onClick={this.onSearchClearIconClick}>
                    <i className={classNames('icon mbc-icon close circle', userIdInternal.length ? '' : 'hide')} />
                  </span>
                  <span className={classNames('error-message', userIdInternalError.length ? '' : 'hide')}>
                    {userIdInternalError}
                  </span>
                </div>
                <div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={userIdInternal.length ? false : true}
                    onClick={this.onSearchClick}
                  >
                    Search
                  </button>
                </div>
              </div>
              <span className={classNames('error-message', this.state.showNotFoundError ? '' : 'hide')}>
                User details not found. Please provide valid User-ID.
              </span>
            </div>
            <div className={classNames(Styles.flexLayout, Styles.actionWrapper, teamMemberObj.shortId ? '' : 'hide')}>
              <div className={classNames(Styles.userInfoWrapper)}>
                <div>
                  <i className="icon mbc-icon check circle inline" />
                </div>
                <div>
                  <p className={classNames(Styles.userDetails)}>
                    {teamMemberObj.firstName} {teamMemberObj.lastName} <br />
                    AD ID: {teamMemberObj.shortId} | Email: {teamMemberObj.email} <br />
                    Department: {teamMemberObj.department} | Mobile Number: {teamMemberObj.mobileNumber}
                  </p>
                </div>
              </div>
              <div>
                <button className="btn btn-primary" onClick={this.addTeamMember} type="button">
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className={!belongingInternal ? Styles.externalWrapper : 'hide'}>
            <div className={Styles.flexLayout}>
              <div
                className={classNames('input-field-group include-error', companyExternalError.length ? 'error' : '')}
              >
                <label htmlFor="companyExternal" className="input-label">
                  Company<sup>*</sup>
                </label>
                <input
                  type="text"
                  className="input-field"
                  required={true}
                  required-error={requiredError}
                  id="companyExternal"
                  name="companyExternal"
                  placeholder="Type here"
                  value={companyExternal}
                  maxLength={200}
                  onChange={this.textInputOnChange}
                />
                <span className={classNames('error-message', companyExternalError.length ? '' : 'hide')}>
                  {companyExternalError}
                </span>
              </div>
              <div
                className={classNames(
                  'input-field-group include-error',
                  teamPositionExternalError.length ? 'error' : '',
                )}
              >
                <label htmlFor="teamPositionExternal" className="input-label">
                  Team Position (e.g. IT)<sup>*</sup>
                </label>
                <input
                  type="text"
                  className="input-field"
                  required={true}
                  required-error={requiredError}
                  id="teamPositionExternal"
                  name="teamPositionExternal"
                  placeholder="Type here"
                  value={teamPositionExternal}
                  maxLength={200}
                  onChange={this.textInputOnChange}
                />
                <span className={classNames('error-message', teamPositionExternalError.length ? '' : 'hide')}>
                  {teamPositionExternalError}
                </span>
              </div>
            </div>
            <div className={Styles.actionWrapper}>
              <button className="btn btn-primary" onClick={this.addTeamMember} type="button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const addTeamMemberModalContentForFoss: React.ReactNode = (
      <div id="teamsModalDiv" className={classNames(Styles.firstPanel, Styles.addTeamMemberModal)}>
        <div className={Styles.formWrapper}>
          {/* <div className={belongingInternal ? Styles.internalWrapper : 'hide'}> */}
          <div
            className={classNames(
              'input-field-group include-error',
              shortIDError.length ? 'error' : '',
              Envs.OIDC_PROVIDER === 'INTERNAL' ? 'hide' : '',
            )}
          >
            <label htmlFor="shortID" className="input-label">
              User Name / Email<sup>*</sup>
            </label>
            <input
              type="email"
              className="input-field"
              required={true}
              required-error={requiredError}
              id="shortID"
              name="shortID"
              placeholder="example@example.com"
              autoComplete="off"
              value={shortID}
              maxLength={200}
              onChange={this.textInputOnChange}
              onBlur={this.validateEmailID}
            />
            <span className={classNames('error-message', shortIDError.length ? '' : 'hide')}>{shortIDError}</span>
          </div>
          <div className={classNames(Styles.flexLayout, Envs.OIDC_PROVIDER !== 'INTERNAL' ? 'hide' : '')}>
            <div className={classNames('input-field-group include-error', shortIDError.length ? 'error' : '')}>
              <label htmlFor="shortID" className="input-label">
                User ID<sup>*</sup>
              </label>
              <input
                type="text"
                className="input-field"
                required={true}
                required-error={requiredError}
                id="shortID"
                name="shortID"
                placeholder="Type here"
                autoComplete="off"
                value={shortID}
                maxLength={200}
                onChange={this.textInputOnChange}
              />
              <span className={classNames('error-message', shortIDError.length ? '' : 'hide')}>{shortIDError}</span>
            </div>

            <div className={classNames('input-field-group include-error', emailError.length ? 'error' : '')}>
              <label htmlFor="email" className="input-label">
                Email<sup>*</sup>
              </label>
              <input
                type="text"
                className="input-field"
                required={true}
                required-error={requiredError}
                id="email"
                name="email"
                placeholder="example@example.com"
                autoComplete="off"
                value={email}
                maxLength={200}
                onChange={this.textInputOnChange}
                onBlur={this.validateEmailID}
              />
              <span className={classNames('error-message', emailError.length ? '' : 'hide')}>{emailError}</span>
            </div>
          </div>
          <div className={Styles.flexLayout}>
            <div className={classNames('input-field-group include-error', firstNameError.length ? 'error' : '')}>
              <label htmlFor="firstName" className="input-label">
                First Name<sup>*</sup>
              </label>
              <input
                type="text"
                className="input-field"
                required={true}
                required-error={requiredError}
                id="firstName"
                name="firstName"
                placeholder="Type here"
                autoComplete="off"
                value={firstName}
                maxLength={200}
                onChange={this.textInputOnChange}
              />
              <span className={classNames('error-message', firstNameError.length ? '' : 'hide')}>{firstNameError}</span>
            </div>

            <div className={classNames('input-field-group include-error', lastNameError.length ? 'error' : '')}>
              <label htmlFor="lastName" className="input-label">
                Last Name<sup>*</sup>
              </label>
              <input
                type="text"
                className="input-field"
                required={true}
                required-error={requiredError}
                id="lastName"
                name="lastName"
                placeholder="Type here"
                autoComplete="off"
                value={lastName}
                maxLength={200}
                onChange={this.textInputOnChange}
              />
              <span className={classNames('error-message', lastNameError.length ? '' : 'hide')}>{lastNameError}</span>
            </div>
          </div>

          <div className={Styles.flexLayout}>
            <div className={classNames('input-field-group include-error', companyError.length ? 'error' : '')}>
              <label htmlFor="company" className="input-label">
                Company<sup>*</sup>
              </label>
              <input
                type="text"
                className="input-field"
                required={true}
                required-error={requiredError}
                id="company"
                name="company"
                placeholder="Type here"
                autoComplete="off"
                value={company}
                maxLength={200}
                onChange={this.textInputOnChange}
              />
              <span className={classNames('error-message', companyError.length ? '' : 'hide')}>{companyError}</span>
            </div>

            <div className={classNames('input-field-group include-error', departmentError.length ? 'error' : '')}>
              <label htmlFor="department" className="input-label">
                Department<sup>*</sup>
              </label>
              <input
                type="text"
                className="input-field"
                required={true}
                required-error={requiredError}
                id="department"
                name="department"
                placeholder="Type here"
                autoComplete="off"
                value={department}
                maxLength={200}
                onChange={this.textInputOnChange}
              />
              <span className={classNames('error-message', departmentError.length ? '' : 'hide')}>
                {departmentError}
              </span>
            </div>
          </div>

          <div className={Styles.flexLayout}>
            <div className={classNames('input-field-group include-error', teamPositionError.length ? 'error' : '')}>
              <label htmlFor="teamPosition" className="input-label">
                Team Position (e.g. IT)<sup>*</sup>
              </label>
              <input
                type="text"
                className="input-field"
                required={true}
                required-error={requiredError}
                id="teamPosition"
                name="teamPosition"
                placeholder="Type here"
                autoComplete="off"
                value={teamPosition}
                maxLength={200}
                onChange={this.textInputOnChange}
              />
              <span className={classNames('error-message', teamPositionError.length ? '' : 'hide')}>
                {teamPositionError}
              </span>
            </div>

            <div className={classNames('input-field-group include-error', mobileNumberError.length ? 'error' : '')}>
              <label htmlFor="mobileNumber" className="input-label">
                Mobile No.<sup>*</sup>
              </label>
              <input
                type="text"
                className="input-field"
                required={true}
                required-error={requiredError}
                id="mobileNumber"
                name="mobileNumber"
                placeholder="+49123456"
                autoComplete="off"
                value={mobileNumber}
                maxLength={15}
                onChange={this.validateMobile}
              />
              <span className={classNames('error-message', mobileNumberError.length ? '' : 'hide')}>
                {mobileNumberError}
              </span>
            </div>
          </div>

          <div className={classNames(Styles.flexLayout, Styles.actionWrapper, Styles.saveButton)}>
            <div>
              <button className="btn btn-primary" onClick={this.addTeamMemberForFoss} type="button">
                Save
              </button>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    );

    return (
      <Modal
        title={
          (this.props.editMode ? 'Edit' : 'Add') +
          ' ' +
          (this.props.modalTitleText ? this.props.modalTitleText : 'team member')
        }
        showAcceptButton={false}
        showCancelButton={false}
        buttonAlignment="right"
        show={this.props.showAddTeamMemberModal}
        content={Envs.ENABLEINTERNALUSERINFO ? addTeamMemberModalContent : addTeamMemberModalContentForFoss}
        onCancel={this.onModalCancel}
      />
    );
  }

  public setTeamMemberData = (teamMemberObj: ITeams, editMode: boolean) => {
    if (editMode) {
      if (teamMemberObj.userType === TeamMemberType.INTERNAL) {
        this.setState({
          belongingInternal: true,
          teamPositionInternal: teamMemberObj.teamMemberPosition,
          userIdInternal: teamMemberObj.shortId,
          teamMemberObj,
          firstName: teamMemberObj.firstName,
          lastName: teamMemberObj.lastName,
          company: teamMemberObj.company,
          department: teamMemberObj.department,
          mobileNumber: teamMemberObj.mobileNumber,
          email: teamMemberObj.email,
          shortID: teamMemberObj.shortId,
          teamPosition: teamMemberObj.teamMemberPosition,
        });
      } else {
        this.setState({
          belongingInternal: false,
          teamPositionExternal: teamMemberObj.teamMemberPosition,
          companyExternal: teamMemberObj.company,
          teamMemberObj,
          firstName: teamMemberObj.firstName,
          lastName: teamMemberObj.lastName,
          company: teamMemberObj.company,
          department: teamMemberObj.department,
          mobileNumber: teamMemberObj.mobileNumber,
          email: teamMemberObj.email,
          shortID: teamMemberObj.shortId,
          teamPosition: teamMemberObj.teamMemberPosition,
        });
      }
    } else {
      this.clearModalFields();
    }
  };

  protected onModalCancel = () => {
    this.clearModalFields();
    this.props.onAddTeamMemberModalCancel();
  };

  protected onSearchClearIconClick = () => {
    this.setState({ userIdInternal: '' });
  };

  protected onSearchClick = () => {
    const internalMemberPosition = this.state.teamPositionInternal;
    const seachUserId = this.state.userIdInternal;

    ProgressIndicator.show();

    ApiClient.getDRDUserInfo(seachUserId)
      .then((data: any) => {
        const teamMemberObj: ITeams = {
          department: data.department,
          email: data.email,
          firstName: data.firstName,
          shortId: data.id,
          lastName: data.lastName,
          userType: TeamMemberType.INTERNAL,
          teamMemberPosition: internalMemberPosition,
        };

        if (data.mobileNumber !== '') {
          teamMemberObj.mobileNumber = data.mobileNumber;
        }

        this.setState(
          {
            teamMemberObj,
            showNotFoundError: false,
          },
          () => {
            ProgressIndicator.hide();
          },
        );
      })
      .catch(() => {
        ProgressIndicator.hide();
        this.setState({
          showNotFoundError: true,
        });
      });
  };

  protected textInputOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const name: string = e.currentTarget.name;
    const value: string = e.currentTarget.value;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  protected addTeamMember = () => {
    let teamMember: ITeams = this.state.teamMemberObj;
    const belongingInternal = teamMember.userType === TeamMemberType.INTERNAL;
    let proceedSave = false;
    if (belongingInternal && this.validateInternalTeamMemberForm()) {
      teamMember.teamMemberPosition = this.state.teamPositionInternal;
      proceedSave = true;
    } else if (this.validateExternalTeamMemberForm()) {
      teamMember = {
        company: this.state.companyExternal,
        teamMemberPosition: this.state.teamPositionExternal,
        userType: TeamMemberType.EXTERNAL,
      };
      proceedSave = true;
    }

    if (proceedSave) {
      this.props.onUpdateTeamMemberList(teamMember);
    }
  };

  protected addTeamMemberForFoss = () => {
    const teamMember: ITeams = this.state.teamMemberObj;
    let proceedSave = false;
    if (this.validateInternalTeamMemberFormForFoss()) {
      teamMember.company = this.state.company;
      teamMember.department = this.state.department;
      teamMember.email = Envs.OIDC_PROVIDER === 'INTERNAL' ? this.state.email : this.state.shortID;
      teamMember.firstName = this.state.firstName;
      teamMember.lastName = this.state.lastName;
      teamMember.mobileNumber = this.state.mobileNumber;
      teamMember.shortId = this.state.shortID;
      teamMember.userType = TeamMemberType.INTERNAL;
      teamMember.teamMemberPosition = this.state.teamPosition;
      proceedSave = true;
    }
    if (proceedSave) {
      this.props.onUpdateTeamMemberList(teamMember);
    }
  };

  protected clearModalFields() {
    this.setState({
      belongingInternal: true,
      teamPositionInternal: '',
      teamPositionInternalError: null,
      userIdInternal: '',
      userIdInternalError: null,
      companyExternal: '',
      companyExternalError: '',
      teamPositionExternal: '',
      teamPositionExternalError: '',
      teamMemberObj: {
        shortId: '',
        department: '',
        email: '',
        firstName: '',
        lastName: '',
        userType: '',
        mobileNumber: '',
        teamMemberPosition: '',
      },
      showNotFoundError: false,
    });

    InputFieldsUtils.resetErrors('#teamsModalDiv');
  }

  protected onBelongingChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ belongingInternal: e.currentTarget.value === 'Internal' });
  };

  protected onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyPressed = event.which;
    if (keyPressed === 13) {
      this.onSearchClick();
    }
  };

  protected validateInternalTeamMemberForm = () => {
    let formValid = true;
    const errorMissingEntry = '*Missing entry';

    if (this.state.teamPositionInternal === '') {
      this.setState({ teamPositionInternalError: errorMissingEntry });
      formValid = false;
    }

    if (this.state.teamMemberObj.shortId === '') {
      this.setState({ userIdInternalError: errorMissingEntry });
      formValid = false;
    }

    return formValid;
  };

  protected validateExternalTeamMemberForm = () => {
    let formValid = true;
    const errorMissingEntry = '*Missing entry';

    if (this.state.companyExternal === '') {
      this.setState({ companyExternalError: errorMissingEntry });
      formValid = false;
    }

    if (this.state.teamPositionExternal === '') {
      this.setState({ teamPositionExternalError: errorMissingEntry });
      formValid = false;
    }

    return formValid;
  };

  protected validateInternalTeamMemberFormForFoss = () => {
    let formValid = true;
    const errorMissingEntry = '*Missing entry';
    if (Envs.OIDC_PROVIDER === 'INTERNAL') {
      if (
        this.state.teamPosition === '' ||
        this.state.teamPosition === null ||
        this.state.shortID === '' ||
        this.state.shortID === null ||
        this.state.company === '' ||
        this.state.company === null ||
        this.state.department === '' ||
        this.state.department === null ||
        this.state.firstName === '' ||
        this.state.firstName === null ||
        this.state.lastName === '' ||
        this.state.lastName === null ||
        this.state.email === '' ||
        this.state.email === null ||
        this.state.mobileNumber === '' ||
        this.state.mobileNumber === null ||
        !this.state.isEmailValid
      ) {
        formValid = false;
      }

      if (this.state.teamPosition === '' || this.state.teamPosition === null) {
        this.setState({ teamPositionError: errorMissingEntry });
      } else {
        this.setState({ teamPositionError: '' });
      }

      if (this.state.shortID === '' || this.state.shortID === null) {
        this.setState({ shortIDError: errorMissingEntry });
      } else {
        this.setState({ shortIDError: '' });
      }

      if (this.state.company === '' || this.state.company === null) {
        this.setState({ companyError: errorMissingEntry });
      } else {
        this.setState({ companyError: '' });
      }

      if (this.state.department === '' || this.state.department === null) {
        this.setState({ departmentError: errorMissingEntry });
      } else {
        this.setState({ departmentError: '' });
      }

      if (this.state.firstName === '' || this.state.firstName === null) {
        this.setState({ firstNameError: errorMissingEntry });
      } else {
        this.setState({ firstNameError: '' });
      }

      if (this.state.lastName === '' || this.state.lastName === null) {
        this.setState({ lastNameError: errorMissingEntry });
      } else {
        this.setState({ lastNameError: '' });
      }

      if (this.state.email === '' || this.state.email === null) {
        this.setState({ emailError: errorMissingEntry });
      } else {
        if (this.state.isEmailValid) {
          this.setState({ emailError: '' });
        }
      }

      if (this.state.mobileNumber === '' || this.state.mobileNumber === null) {
        this.setState({ mobileNumberError: errorMissingEntry });
      } else {
        this.setState({ mobileNumberError: '' });
      }
    } else {
      if (
        this.state.teamPosition === '' ||
        this.state.teamPosition === null ||
        this.state.company === '' ||
        this.state.company === null ||
        this.state.department === '' ||
        this.state.department === null ||
        this.state.firstName === '' ||
        this.state.firstName === null ||
        this.state.lastName === '' ||
        this.state.lastName === null ||
        this.state.shortID === '' ||
        this.state.shortID === null ||
        this.state.mobileNumber === '' ||
        this.state.mobileNumber === null ||
        !this.state.isEmailValid
      ) {
        formValid = false;
      }

      if (this.state.teamPosition === '' || this.state.teamPosition === null) {
        this.setState({ teamPositionError: errorMissingEntry });
      } else {
        this.setState({ teamPositionError: '' });
      }

      if (this.state.company === '' || this.state.company === null) {
        this.setState({ companyError: errorMissingEntry });
      } else {
        this.setState({ companyError: '' });
      }

      if (this.state.department === '' || this.state.department === null) {
        this.setState({ departmentError: errorMissingEntry });
      } else {
        this.setState({ departmentError: '' });
      }

      if (this.state.firstName === '' || this.state.firstName === null) {
        this.setState({ firstNameError: errorMissingEntry });
      } else {
        this.setState({ firstNameError: '' });
      }

      if (this.state.lastName === '' || this.state.lastName === null) {
        this.setState({ lastNameError: errorMissingEntry });
      } else {
        this.setState({ lastNameError: '' });
      }

      if (this.state.shortID === '' || this.state.shortID === null) {
        this.setState({ shortIDError: errorMissingEntry });
      } else {
        if (this.state.isEmailValid) {
          this.setState({ shortIDError: '' });
        }
      }

      if (this.state.mobileNumber === '' || this.state.mobileNumber === null) {
        this.setState({ mobileNumberError: errorMissingEntry });
      } else {
        this.setState({ mobileNumberError: '' });
      }
    }
    return formValid;
  };

  protected validateMobile(el: React.FormEvent<HTMLInputElement>) {
    const numberVal = el.currentTarget.value;
    if (Validation.validateMobileNumber(numberVal)) {
      this.setState({ mobileNumber: numberVal });
    }
  }

  protected validateEmailID(el: React.FormEvent<HTMLInputElement>) {
    const emailVal = el.currentTarget.value;
    if (Envs.OIDC_PROVIDER === 'INTERNAL') {
      if (!Validation.validateEmail(emailVal)) {
        this.setState({ emailError: 'Invalid Email', isEmailValid: false });
      } else {
        this.setState({ emailError: '', isEmailValid: true });
      }
    } else {
      if (!Validation.validateEmail(emailVal)) {
        this.setState({ shortIDError: 'Invalid User Name / Email', isEmailValid: false });
      } else {
        this.setState({ shortIDError: '', isEmailValid: true });
      }
    }
  }
}
