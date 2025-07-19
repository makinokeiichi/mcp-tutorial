# Google検索機能の使用方法

Google検索機能を使用してAI記事を効率的に発見・収集する方法を説明します。

## 事前設定

Google Custom Search APIを使用するため、以下の設定が必要です：

### 1. Google Cloud Console での設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. Custom Search API を有効化
4. APIキーを作成

### 2. Custom Search Engine の設定

1. [Google Custom Search](https://cse.google.com/cse/) にアクセス  
2. 新しい検索エンジンを作成
3. 検索エンジンID（CX）を取得

### 3. 環境変数の設定

```bash
export GOOGLE_SEARCH_API_KEY="your-api-key-here"
export GOOGLE_SEARCH_CX="your-custom-search-engine-id"
```

## 基本的な使用方法

### 1. シンプルな検索

```json
{
  "name": "google-search",
  "arguments": {
    "query": "AI ヘルスケア 最新"
  }
}
```

### 2. 検索結果数を制限

```json
{
  "name": "google-search",
  "arguments": {
    "query": "機械学習 金融 活用事例",
    "limit": 5
  }
}
```

### 3. 特定のサイト内検索

```json
{
  "name": "google-search",
  "arguments": {
    "query": "人工知能 導入事例",
    "limit": 10,
    "site": "news.google.com"
  }
}
```

## 高度な活用例

### Google検索 + スクレイピングの連携

1. **検索で関連記事を発見**
   ```json
   {
     "name": "google-search", 
     "arguments": {
       "query": "ChatGPT 企業活用 成功事例",
       "limit": 5
     }
   }
   ```

2. **検索結果のURLをスクレイピング**
   ```json
   {
     "name": "scrape-url",
     "arguments": {
       "url": "https://example.com/chatgpt-case-study",
       "extractKeywords": true
     }
   }
   ```

### 定期的なコンテンツ収集ワークフロー（将来の拡張）

```javascript
// 将来的には以下のような自動化が可能：
async function collectAINews() {
  // 1. 最新のAI記事を検索
  const searchResult = await googleSearch({
    query: "AI 最新ニュース",
    limit: 10
  });
  
  // 2. 各URLをスクレイピング
  for (const item of searchResult.results) {
    const content = await scrapeUrl({
      url: item.url,
      extractKeywords: true
    });
    
    // 3. データベースに保存
    await saveToDatabase(content);
  }
}
```

## エラーハンドリング

### API制限エラー
```
Google Custom Search APIの利用制限に達しました。
しばらく時間をおいてから再試行してください。
```

### 認証エラー  
```
Google Search APIキーが無効です。
正しいAPIキーを設定してください。
```

### 設定エラー
```
Google Search が設定されていません。
環境変数 GOOGLE_SEARCH_API_KEY と GOOGLE_SEARCH_CX を設定してください。
```

## ベストプラクティス

### 1. 効果的な検索クエリ

- **具体的なキーワードを使用**: 「AI」より「機械学習 画像認識」
- **業界を指定**: 「AI 医療」「機械学習 製造業」  
- **時期を限定**: 「AI 2024 最新」「機械学習 導入事例 2024」

### 2. API使用量の管理

- 1日あたりの検索回数に注意（Google Custom Search APIの制限）
- 必要以上に多くの結果を取得しない（limit パラメータを適切に設定）
- サイト指定検索を活用して精度を向上

### 3. 既存ツールとの連携

- Google検索で発見したURLは `scrape-url` ツールで詳細取得
- 取得したコンテンツは `extract-keywords` でキーワード抽出
- `categorize-use-case` で自動分類を実施

## 制限事項

- Google Custom Search API の1日あたりの無料利用枠: 100回
- 1回のリクエストで取得可能な最大結果数: 10件
- リアルタイム検索ではない（Googleのインデックス更新による遅延あり）

## サポート

設定や使用方法でご不明な点がございましたら、プロジェクトのIssueページでお気軽にお尋ねください。