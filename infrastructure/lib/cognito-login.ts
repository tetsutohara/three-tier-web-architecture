import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";

type Props = cdk.StackProps & {
  distribution?: cloudfront.Distribution;

  // ローカル開発用のCallback（任意）
  localCallbackUrl?: string; // 例: "http://localhost:5173/"
};

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly userPoolDomain: cognito.UserPoolDomain;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    // 1) User Pool
    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: "three-tier-webapp-userpool",
      selfSignUpEnabled: true,
      signInAliases: { email: true }, // emailでログイン
      standardAttributes: {
        email: { required: true, mutable: true },
      },
      passwordPolicy: {
        minLength: 12,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 本番はRETAIN推奨
    });

    // 2) CloudFrontドメイン（ある場合）をcallback/logoutに入れる
    const cfDomain = props.distribution?.distributionDomainName;
    const callbackUrls: string[] = [];
    const logoutUrls: string[] = [];

    // CloudFrontを使う場合は https://<domain>/ を入れる
    if (cfDomain) {
      callbackUrls.push(`https://${cfDomain}/`);
      logoutUrls.push(`https://${cfDomain}/`);
    }

    // ローカル開発用（任意）
    if (props.localCallbackUrl) {
      callbackUrls.push(props.localCallbackUrl);
      logoutUrls.push(props.localCallbackUrl);
    }

    // 3) App Client（Hosted UI / OAuth設定）
    const userPoolClient = userPool.addClient("UserPoolClient", {
      userPoolClientName: "three-tier-webapp-client",
      generateSecret: false, // SPAなら false（PKCE前提）
      authFlows: {
        userSrp: true, // Hosted UIで使うことが多い
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true, // SPA推奨（PKCE）
        },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: callbackUrls.length ? callbackUrls : ["http://localhost:5173/"],
        logoutUrls: logoutUrls.length ? logoutUrls : ["http://localhost:5173/"],
      },
      // セキュリティ上、存在しないユーザーを隠したい場合
      preventUserExistenceErrors: true,
    });

    // 4) Cognito Domain（Hosted UI のURLに必要）
    // ここはユニークである必要があります。環境名などを付けるのが安全です。
    const domainPrefix = `three-tier-${cdk.Stack.of(this).stackName.toLowerCase()}`;

    const userPoolDomain = userPool.addDomain("UserPoolDomain", {
      cognitoDomain: { domainPrefix },
    });

    // 5) 便利な出力（フロント設定で使う）
    new cdk.CfnOutput(this, "CognitoUserPoolId", { value: userPool.userPoolId });
    new cdk.CfnOutput(this, "CognitoUserPoolClientId", { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, "CognitoDomainPrefix", { value: domainPrefix });

    // Hosted UI の issuer/authorize endpoint を組み立てるのに region も出すと便利
    new cdk.CfnOutput(this, "AwsRegion", { value: this.region });

    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    this.userPoolDomain = userPoolDomain;
  }
}