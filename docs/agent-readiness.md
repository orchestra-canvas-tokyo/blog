# OCT Blog Agent Readiness

対象: https://blog.orch-canvas.tokyo / 親issue #70、子issue #71–#74。
AI検索と回答での参照を許可し、モデル学習は拒否する（所有者確認済み）。

## 15項目の適用判断

| 項目                     | このスタックでの対応                                                                           | 確認先                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| robots.txt               | 明示User-agent、公開ページ許可、内部アセット・Cloudflare内部パス拒否                           | `/robots.txt`、200 / text/plain                             |
| sitemap                  | 公開記事と使用中タグのcanonical URLをリクエストごとに生成。再デプロイでpublish/unpublishを反映 | `/sitemap.xml`、robotsから参照                              |
| Link headers             | ホームHTML/Markdownに既存Linkを保持してdiscovery relationsを追加                               | `api-catalog`、`service-desc`、`service-doc`、`describedby` |
| DNS-AID                  | DNS管理者作業待ち。下記の候補レコード・DNSSEC手順を用意                                        | DNSレコードは未変更                                         |
| Markdown                 | Acceptの品質値に従いホーム・記事・タグを変換。HTML既定。記事.mdも提供                          | `Content-Type: text/markdown` / `Vary: Accept`              |
| AI bot rules             | OAI/Claude/Perplexity検索・ユーザー取得を許可。GPTBot/ClaudeBot等学習botを拒否                 | robotsの各グループ                                          |
| Content Signals          | `search=yes, ai-input=yes, ai-train=no`                                                        | robotsの許可グループ                                        |
| API Catalog              | 実在するpublic content API、OpenAPI、docs、statusをRFC 9727 linksetに記載                      | `/.well-known/api-catalog`                                  |
| OAuth/OIDC               | 適用外。public read-only APIにissuer/認証サーバーがない                                        | metadataを公開しない                                        |
| OAuth Protected Resource | 適用外。保護されたAPIがない                                                                    | metadataを公開しない                                        |
| auth.md                  | 適用外。agent登録・credential発行がない                                                        | 認証不要とAPI docs / Skillに記載                            |
| MCP Server Card          | 適用外。MCPサーバー・transportがない                                                           | WebMCPとは別機能として扱う                                  |
| Agent Skills             | read-oct-blogの配信バイトからSHA-256を生成                                                     | `/.well-known/agent-skills/index.json`                      |
| WebMCP                   | document.modelContextを優先しnavigatorの旧APIをfallback。検索・記事取得のみ                    | onMount登録、AbortSignalでcleanup                           |
| ARD                      | public APIとSkillのみ。CORSあり、url/data排他、代表クエリ                                      | `/.well-known/ai-catalog.json`                              |

Content Signals / Agent Skills / ARD / WebMCP / DNS-AIDはdraftまたは実験的仕様を含む。
全項目passを目的に架空のOAuth/MCPサービスを宣言しない。
robotsとContent Signalsはクローラーが従う利用方針であり、アクセス制御や法的許諾の代替ではない。

## DNS管理者による作業

2026-10-12 UTCのCloudflare DoH照会では、`_index._agents.blog.orch-canvas.tokyo` SVCBはNXDOMAIN、`orch-canvas.tokyo` DS照会はAnswerなし、AD=falseだった。
この観測だけで権威ゾーンの署名状態を断定しない。少なくとも親ゾーンから検証できるDSチェーンは確認できていない。
今回の環境にDNS書き込み権限やレジストラ管理権限がなく、DNS変更は行っていない。

1. PRの通常リリース後、`/.well-known/ai-catalog.json`が本番で200 / application/json / CORSを返すことを確認する。
2. [DNS-AID draft](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)とDNSプロバイダーが対応するSvcParamKeyを確認する。draftはカスタムキーのIANA番号を未割当としているため、未登録の文字列キー`well-known`等をそのまま本番投入しない。
3. `ops/dns/agent-discovery.zone`を検討する。`key65400`はこの候補だけで定義したprivate-use endpointパラメーターで、標準の番号ではない。利用するresolver/clientとの合意が必要。レコードは本番未適用で、scannerのpassも未確認。
4. `_index`はHTTPのカタログentrypointを指す。実在しない`_a2a`や`mcp` ALPNを宣言しない。TXTはARD用の補助discoveryで、DNS-AID SVCBの代替ではない。
5. CloudflareのゾーンDNSSECを有効にし、その実際のDS情報をレジストラへ登録する。既存DSを推測値で置換しない。`dig +dnssec`と検証resolverでDS/DNSKEY/RRSIGチェーン、AD=trueを確認する。
6. DNSSECとDNS-AID対応が確認できるまでissue #74をDNS作業待ちとして保持する。

## PRの依存関係

`main` → `codex/agent-ready/crawl` → `codex/agent-ready/markdown` → `codex/agent-ready/discovery` → `codex/agent-ready/operations`。

親issue #70のネイティブsub-issuesとして#71–#74を関連付けた。
公式github/gh-stack v0.2.1の`gh stack submit --auto --remote origin`で、既存のDraft PR #75–#78をGitHub Stack #79へ登録済み。
登録はリポジトリのGitHub Actions認証で実行し、一度限りの登録workflowは完了後に削除した。
登録ジョブ: https://github.com/orchestra-canvas-tokyo/blog/actions/runs/38194104352

認証済み開発環境で既存Stackを操作する場合:

```sh
gh auth status
gh extension install github/gh-stack
git config remote.pushDefault origin
gh stack checkout 79
gh stack view --json
```

レビュー・mergeは下から順に行う。Stack全体をmergeする場合は承認後に`gh stack merge 79 --yes`を使う。
この作業ではmerge・本番deployは行っていない。

## 検証とリリース

- `npm run test:agents`: HTTP契約、Accept品質値、記事本文・譜例・表、404/HEAD、pagination、未公開fixture除外、APIの入力検証、discoveryリンク、digest、WebMCP登録・cleanup。
- `npm run precommit`: 型チェック、Prettier、ESLint。
- `npm run build`: OGPの既存検証とCloudflare向けビルド。
- `npm run test:worker`: ビルド済みPages WorkerをMiniflareで実行。Nodeテストでは検出できないbrowser-fieldのDOM参照を含め、Markdown、API、discoveryを検証。Svelte SSRのAsyncLocalStorage用に`nodejs_als`を使用する。本番Pagesでも`nodejs_als`または`nodejs_compat`設定を確認する。
- 本番反映は既存の`main` → リリースPR → `production`フローに従う。各層は下からレビューしmergeする。
- リリース後、`curl -i https://blog.orch-canvas.tokyo/robots.txt`、`curl -i -H 'Accept: text/markdown' https://blog.orch-canvas.tokyo/`等で200/MIME/Link/Varyを確認する。AI Crawl Controlのedge側bot blockやmanaged robots追記も確認する。
- `POST https://isitagentready.com/api/scan`、JSON body `{"url":"https://blog.orch-canvas.tokyo"}` で再診断する。WebMCPは対応ブラウザーでtool登録を確認する。適用外項目・DNS未設定はpass扱いにしない。
- 不具合時は通常のrevert/releaseで戻す。DNS/DNSSECは別変更として管理する。

## 参照

ユーザー提示の15個の`https://isitagentready.com/.well-known/agent-skills/<name>/SKILL.md`を確認し、対応するRFC・公式draftを参照した。
[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309)、[Sitemaps](https://www.sitemaps.org/protocol.html)、[RFC 8288](https://www.rfc-editor.org/rfc/rfc8288)、[RFC 9727](https://www.rfc-editor.org/rfc/rfc9727)、[RFC 9264](https://www.rfc-editor.org/rfc/rfc9264)、[Agent Skills Discovery](https://github.com/cloudflare/agent-skills-discovery-rfc)、[WebMCP](https://webmachinelearning.github.io/webmcp/)、[ARD](https://agenticresourcediscovery.org/)。
