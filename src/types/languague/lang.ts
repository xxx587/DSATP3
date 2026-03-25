/**
 * @file lang.ts
 * @description 다국어 지원을 위한 사전(Dictionary) 및 각 컴포넌트별 언어 인터페이스를 정의하기 위한 파일
 */
export interface AuthCommonLang {
	idText: string;
	passwordText: string;
	passwordRegexPlaceholder: string;
	nicknameText: string;
	countryCodeText: string;
	countryCodeKR: string;
	countryCodeJP: string;
	emailText: string;
}

export interface ChatCommonLang {
	receivedMessages: string;
	sentMessage: string;
	loadingMessage: string;
}

export interface PresetClothesCommonLang {
	category1: string;
	category2: string;
	category3: string;
	category4: string;
	category5: string;
}

export interface LoginComponentLang extends AuthCommonLang {
	successLoginToast: string;
	diffIdPasswordToast: string;
	loginErrorToast: string;
	loginText: string;
	explainLoginText: string;
	idPlaceholder: string;
	passwordPlaceholder: string;
	haveNotAccount: string;
	registerText: string;
}

export interface MyPageComponentLang extends AuthCommonLang {
	fixUserInfoText: string;
	explainFixUserInfoText: string;
	currentPasswordText: string;
	newPasswordText: string;
	newPasswordConfirmText: string;
	newPasswordConfirmPlaceholder: string;
	confirmFix: string;
	deleteAccount: string;
	cancel: string;
	passwordMatchSuccess: string;
}

export interface RegisterComponentLang extends AuthCommonLang {
	registerText: string;
	explainRegisterText1: string;
	explainRegisterText2: string;
	idPlaceholder: string;
	duplicateButton: string;
	passwordConfirmText: string;
	passwordConfirmPlaceholder: string;
	nicknamePlaceholder: string;
	emailPlaceholder: string;
	termText: string;
	termAgree: string;
	registerButton: string;
	isHaveAccount: string;
	goLogin: string;
	matchPassword: string;
	isNotMatchPassword: string;
}

export interface ChatSidebarComponentLang {
	messageText: string;
}

export interface ChatSidebarTabsComponentLang extends ChatCommonLang {
	writeMessage: string;
}

export type MailDetailHeaderComponentLang = ChatCommonLang;

export interface MailDetailViewComponentLang extends ChatCommonLang {
	messageNotFound: string;
}

export interface MailItemComponentLang {
	sender: string;
	receiver: string;
	read: string;
	notRead: string;
}

export interface ReceivedMailListComponentLang extends ChatCommonLang {
	notFoundReceivedMail: string;
}

export interface SentMailListComponentLang extends ChatCommonLang {
	notFoundSendMail: string;
}

export interface WriteMailFormComponentLang extends ChatCommonLang {
	notFoundNickname: string;
	failSendMail: string;
	receiverNickname: string;
	receiverNicknamePlaceholder: string;
	content: string;
	contentPlaceholder: string;
	sending: string;
	send: string;
}

export interface HomeClientComponentLang {
	maxLoadPost: string;
	notFoundPost: string;
}

export interface HeaderComponentLang {
	logoutToast: string;
	closet: string;
	openChat: string;
	myPage: string;
}

export interface HeaderAuthComponentLang {
	login: string;
	register: string;
	honorifics: string;
	logout: string;
}

export interface LangToggleComponentLang {
	changeLanguage: string;
}

export interface NotificationHeaderComponentLang {
	notificationText: string;
	readAll: string;
	readNotificationDelete: string;
}

export interface NotificationItemComponentLang {
	who: string;
	writtenComment: string;
	commentLast: string;
	board: string;
	likedBoard: string;
	likeBoardLast: string;
	receivedMessage: string;
	send: string;
	newLabel: string;
}

export interface NotificationListComponentLang {
	notFoundNotification: string;
}

export interface BoardEtcComponentLang {
	report: string;
	fix: string;
	delete: string;
	cancel: string;
}

export interface BoardSearchComponentLang {
	searchPlaceholder: string;
}

export interface CommentInputComponentLang {
	writingReply: string;
	writeCommentPlaceholder: string;
	writeComment: string;
}

export interface CommentItemComponentLang {
	changeComment: string;
	cancel: string;
	reply: string;
	edit: string;
	delete: string;
	report: string;
}

export interface CommentListComponentLang {
	firstComment: string;
}

export interface GlobalCommentModalComponentLang {
	loadingErrorToast: string;
}

export interface OrderByWriteComponentLang {
	recent: string;
	like: string;
	write: string;
}

export interface UsePostActionsLang {
	likeError: string;
	bookmarkError: string;
	deleteConfirm: string;
	deleteSuccess: string;
	notAuthorError: string;
	deleteFail: string;
	reportPrompt: string;
	reportSuccess: string;
	alreadyReportedError: string;
	reportFail: string;
}

export interface UseRequireAuthLang {
	requireLogin: string;
}

export interface TranslateAbleTextComponentLang {
	translateSuccess: string;
	translateFail: string;
}

export interface WriteContentFormAreaComponentLang {
	titlePlaceholder: string;
	contentPlaceholder: string;
}

export interface WriteContentHeaderComponentLang {
	cancel: string;
	submitting: string;
	submit: string;
}

export interface WriteContentImageAreaComponentLang {
	makingPresetImage: string;
	changeImage: string;
	selectImage: string;
	selectImageExplain: string;
}

export interface PresetCanvasPreviewComponentLang extends PresetClothesCommonLang {
	selectedPresetPreview: string;
	selectedPresetPreviewExplain: string;
	none: string;
}

export interface PresetEditorComponentLang extends PresetClothesCommonLang {
	loadError: string;
	closetLoadError: string;
	categoryOnlyAllowed1: string;
	categoryOnlyAllowed2: string;
	deleteConfirm: string;
	deleteFail: string;
	requiredTopBottom: string;
	defaultTitle: string;
	editSuccess: string;
	saveSuccess: string;
	editFail: string;
	saveFail: string;
	noName: string;
	dragToAddPrefix: string;
	dragToAddSuffix: string;
	category: string;
	viewAll: string;
	season: string;
	savedPresets: string;
	noSavedPresets: string;
	edit: string;
	delete: string;
	makePresetMode: string;
	editPresetMode: string;
	makePresetDesc: string;
	titlePlaceholder: string;
	saveEdit: string;
	save: string;
	goBack: string;
	myClothesList: string;
	selectCategory: string;
	selected: string;
	select: string;
	viewPreset: string;
}

export interface PresetSelectorListComponentLang {
	noSavedPresets: string;
	savedPresets: string;
}

export interface PresetPreviewCardComponentLang {
	noImage: string;
	delete: string;
}

export interface CategoryComponentLang {
	board: string;
	news: string;
	clothes: string;
	preset: string;
}

export interface WeatherComponentLang {
	noInfo: string;
	noInfoExplain: string;
	humidity: string;
	wind: string;
}

export interface TermComponentLang {
	termsTitle: string;
	termsSec1Title: string;
	termsSec1Item1Title: string;
	termsSec1Item1Desc: string;
	termsSec1Item2Title: string;
	termsSec1Item2Desc: string;
	termsSec1Item3Title: string;
	termsSec1Item3Desc: string;
	termsSec2Title: string;
	termsSec2Item1Title: string;
	termsSec2Item1Desc: string;
	termsSec2Item2Title: string;
	termsSec2Item2Desc: string;
	termsSec2Item3Title: string;
	termsSec2Item3Desc: string;
	termsSec3Title: string;
	termsSec3Intro: string;
	termsSec3Item1Title: string;
	termsSec3Item1Bullet1: string;
	termsSec3Item1Bullet2: string;
	termsSec3Item2Title: string;
	termsSec3Item2Bullet1: string;
	termsSec3Item2Bullet2: string;
	termsSec4Title: string;
	termsSec4Desc: string;
}

export interface UserInfoSearchComponentLang {
	findUsername: string;
	changePassword: string;
	inputEmailExplain: string;
	inputNewPasswordExplain: string;
	email: string;
	emailPlaceholder: string;
	check: string;
	newPassword: string;
	newPasswordConfirm: string;
	passwordMatch: string;
	passwordMismatch: string;
	foundIdPrefix: string;
	foundIdSuffix: string;
	changePasswordButton: string;
	knowAccount: string;
	goLogin: string;
	emailRequired: string;
	invalidEmail: string;
	emailInUse: string;
	emailNotFound: string;
	checkError: string;
	emailCheckRequired: string;
	passwordRegexError: string;
}

export interface ClosetPageComponentLang {
	spring: string;
	summer: string;
	autumn: string;
	winter: string;
	veryCold: string;
	chilly: string;
	cool: string;
	warm: string;
	veryHot: string;
	veryColdDesc: string;
	chillyDesc: string;
	coolDesc: string;
	warmDesc: string;
	veryHotDesc: string;
	dataLoadError: string;
	item: string;
	deleteConfirm: string;
	deleteError: string;
	presetDeleteConfirm: string;
	presetDeleteFail: string;
	category: string;
	viewAll: string;
	season: string;
	savedPresets: string;
	noPresets: string;
	edit: string;
	delete: string;
	myCloset: string;
	closetDesc: string;
	searchPlaceholder: string;
	addPreset: string;
	addCloth: string;
	todayRecommendation: string;
	weatherLoadError: string;
	recommendedCloth: string;
	noRecommendation: string;
	noMatchingCloth: string;
}

export interface ClosetItemCardComponentLang {
	item: string;
	noImage: string;
	noName: string;
	edit: string;
	delete: string;
	selected: string;
	select: string;
}

export interface ClosetFormComponentLang {
	addTitle: string;
	editTitle: string;
	addDesc: string;
	editDesc: string;
	itemName: string;
	itemNamePlaceholder: string;
	imageUpload: string;
	imageEdit: string;
	imageGuide: string;
	imageSizeGuide: string;
	selectFile: string;
	preview: string;
	category: string;
	categorySelect: string;
	season: string;
	seasonSelect: string;
	cancel: string;
	submittingAdd: string;
	submittingEdit: string;
	submitAdd: string;
	submitEdit: string;
	categoryLoadError: string;
	imageOnlyError: string;
	imageSizeError: string;
	allFieldsRequired: string;
	addSuccess: string;
	addError: string;
	editSuccess: string;
	editError: string;
	loadError: string;
	loading: string;
}

export interface UseBoardLang {
	boardLoadError: string;
	presetLoadError: string;
	presetCaptureFail: string;
	titleRequired: string;
	contentRequired: string;
	imageRequired: string;
	editSuccess: string;
	writeSuccess: string;
	uploadFail: string;
	imageOnlyError: string;
}

export interface UseChatLang {
	receiveMessageLoadError: string;
	sendMessageLoadError: string;
	detailMessageLoadError: string;
	sendMessageSuccess: string;
	sendMessageFail: string;
}

export interface UseRegisterLang {
	idRequired: string;
	idRegexError: string;
	idDuplicateError: string;
	idAvailable: string;
	idCheckError: string;
	nicknameRequired: string;
	nicknameRegexError: string;
	nicknameDuplicateError: string;
	nicknameAvailable: string;
	nicknameCheckError: string;
	emailRequired: string;
	emailRegexError: string;
	emailDuplicateError: string;
	emailAvailable: string;
	emailCheckError: string;
	idCheckRequired: string;
	emailCheckRequired: string;
	nicknameCheckRequired: string;
	passwordRegexError: string;
	passwordMismatchError: string;
	registerSuccess: string;
	genericError: string;
}

export interface UseCommentLang {
	commentLoadError: string;
	commentWriteSuccess: string;
	commentWriteFail: string;
	deleteConfirm: string;
	deleteSuccess: string;
	notAuthorError: string;
	deleteFail: string;
	editSuccess: string;
	editFail: string;
	commentTitle: string;
	reportPrompt: string;
	reportSuccess: string;
	reportFail: string;
}

export interface MyPresetComponentLang {
	title: string;
	desc: string;
	addNew: string;
	loading: string;
	edit: string;
	delete: string;
	loadError: string;
	deleteConfirm: string;
	deleteSuccess: string;
	deleteError: string;
}

export interface ShadcnDialogLang {
	confirm: string;
	cancel: string;
}

export interface Dictionary {
	authCommonDict: AuthCommonLang;
	chatCommonDict: ChatCommonLang;
	presetClothesCommonDict: PresetClothesCommonLang;
	loginComponent: LoginComponentLang;
	myPageComponent: MyPageComponentLang;
	registerComponent: RegisterComponentLang;
	chatSidebarComponent: ChatSidebarComponentLang;
	chatSidebarTabsComponent: ChatSidebarTabsComponentLang;
	mailDetailHeaderComponent: MailDetailHeaderComponentLang;
	mailDetailViewComponent: MailDetailViewComponentLang;
	mailItemComponent: MailItemComponentLang;
	receivedMailListComponent: ReceivedMailListComponentLang;
	sentMailListComponent: SentMailListComponentLang;
	writeMailFormComponent: WriteMailFormComponentLang;
	homeClientComponent: HomeClientComponentLang;
	headerComponent: HeaderComponentLang;
	headerAuthComponent: HeaderAuthComponentLang;
	langToggleComponent: LangToggleComponentLang;
	notificationHeaderComponent: NotificationHeaderComponentLang;
	notificationItemComponent: NotificationItemComponentLang;
	notificationListComponent: NotificationListComponentLang;
	boardEtcComponent: BoardEtcComponentLang;
	boardSearchComponent: BoardSearchComponentLang;
	commentInputComponent: CommentInputComponentLang;
	commentItemComponent: CommentItemComponentLang;
	commentListComponent: CommentListComponentLang;
	globalCommentModalComponent: GlobalCommentModalComponentLang;
	orderByWriteComponent: OrderByWriteComponentLang;
	translateAbleTextComponent: TranslateAbleTextComponentLang;
	writeContentFormAreaComponent: WriteContentFormAreaComponentLang;
	writeContentHeaderComponent: WriteContentHeaderComponentLang;
	writeContentImageAreaComponent: WriteContentImageAreaComponentLang;
	presetCanvasPreviewComponent: PresetCanvasPreviewComponentLang;
	presetEditorComponent: PresetEditorComponentLang;
	presetSelectorListComponent: PresetSelectorListComponentLang;
	presetPreviewCardComponent: PresetPreviewCardComponentLang;
	categoryComponent: CategoryComponentLang;
	weatherComponent: WeatherComponentLang;
	termComponent: TermComponentLang;
	useBoard: UseBoardLang;
	useChat: UseChatLang;
	useComment: UseCommentLang;
	usePostActions: UsePostActionsLang;
	useRegister: UseRegisterLang;
	useRequireAuth: UseRequireAuthLang;
	userInfoSearchComponent: UserInfoSearchComponentLang;
	closetPageComponent: ClosetPageComponentLang;
	closetItemCardComponent: ClosetItemCardComponentLang;
	closetFormComponent: ClosetFormComponentLang;
	myPresetComponent: MyPresetComponentLang;
	shadcnDialog: ShadcnDialogLang;
}
