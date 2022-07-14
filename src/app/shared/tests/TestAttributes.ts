enum FormAttributes {
    FormTitle = 'form-title',
    FormError = 'form-error',
    FormLink = 'form-link',
    FormButton = 'form-button',
}

enum UserInputsAttributes {
    UsernameInput = 'username-input',
    EmailInput = 'email-input',
    PasswordInput = 'password-input',
    BioInput = 'bio-input',
    ImageInput = 'image-input',
}

enum ArticleInputsAttributes {
    ArticleTitleInput = 'article-title-input',
    ArticleDescriptionInput = 'article-description-input',
    ArticleBodyInput = 'article-body-input',
    ArticleTagListInput = 'article-tag-list-input',
}

enum SignInPageAttributes {
    SignInBtn = 'sign-in-btn',
    SignUpLink = 'sign-up-link',
}

enum SignUpPageAttributes {
    SignUpBtn = 'sign-up-btn',
    SignInLink = 'sign-in-link',
}

enum ArticleCardAttributes {
    ArticleCard = 'article-card',
    ArticleCardInfo = 'article-card-info',
    ArticleCardAuthorImg = 'article-card-author-img',
    ArticleCardAuthorName = 'article-card-author-name',
    ArticleCardDate = 'article-card-date',
    ArticleCardLikeBtn = 'article-card-like-btn',
    ArticleCardLikeIcon = 'article-card-like-icon',
    ArticleCardTitle = 'article-card-title',
    ArticleCardDescription = 'article-card-description',
    ArticleCardFooter = 'article-card-footer',
    ArticleCardTags = 'article-card-tags',
    ArticleCardReadMoreLink = 'article-card-read-more-link',
}

enum ArticlePageAttributes {
    ArticleTitle = 'article-title',
    ArticleActionsContainer = 'article-actions-container',
    ArticleTag = 'article-tag',
    ArticleLikeBtn = 'article-like-btn',
    ArticleFollowBtn = 'article-follow-btn',
    ArticleDeleteBtn = 'article-delete-btn',
    ArticleEditBtn = 'article-edit-btn',
    ArticleLikeIcon = 'article-like-icon',
    ArticlePageAuthorImg = 'article-page-author-img',
    ArticlePageAuthorName = 'article-page-author-name',
    ArticlePageDate = 'article-page-date',
    ArticlePageBody = 'article-page-body',
}

enum NavBarLinksAttributes {
    NavHomeLink = 'nav-home-link',
    NavSignInLink = 'nav-sign-in-link',
    NavSignUpLink = 'nav-sign-up-link',
    NavNewArticleLink = 'nav-new-article-link',
    NavUserPageLink = 'nav-user-page-link',
    NavSettingsLink = 'nav-settings-link',
}

enum BannerAttributes {
    BannerActions = 'banner-actions',
    UserPageBanner = 'user-page-banner',
    HomePageBanner = 'home-page-banner',
    ArticlePageBanner = 'article-page-banner',
}

enum CommentsAttributes {
    CommentForm = 'comment-form',
    CommentPostBtn = 'comment-post-btn',
    CommentDeleteBtn = 'comment-delete-btn',
    Comment = 'comment',
    CommentTextarea = 'comment-textarea',
}

enum HomePageAttributes {
    YourFeed = 'your-feed',
    GlobalFeed = 'global-feed',
    TaggedArticles = 'tagged-articles',
    TagsContainer = 'tags-container',
    Tag = 'tag',
}

enum NewArticlePageAttributes {
    PublishBtn = 'publish-btn',
}

enum SettingsAttributes {
    SettingsUpdateBtn = 'settings-update-btn',
    SettingsLogoutBtn = 'settings-logout-btn',
}

enum UserPageAttributes {
    UserPageUpdateBtn = 'user-page-update-btn',
    UserPageFollowBtn = 'user-page-follow-btn',
    UserPageImg = 'user-page-img',
    UserPageUsername = 'user-page-username',
    UserPageBio = 'user-page-bio',
}

enum CommonAttributes {
    Header = 'header',
    AppTitle = 'app-title',
    LoadingSpinner = 'loading-spinner',
    AllArticlesLoaded = 'all-articles-loaded',
}

export const TestAttributes = {
    ...FormAttributes,
    ...UserInputsAttributes,
    ...ArticleInputsAttributes,
    ...SignInPageAttributes,
    ...SignUpPageAttributes,
    ...ArticleCardAttributes,
    ...ArticlePageAttributes,
    ...NavBarLinksAttributes,
    ...BannerAttributes,
    ...CommentsAttributes,
    ...HomePageAttributes,
    ...NewArticlePageAttributes,
    ...SettingsAttributes,
    ...UserPageAttributes,
    ...CommonAttributes,
};