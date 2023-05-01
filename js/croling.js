const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://ko.wiktionary.org/w/index.php?title=%EB%B6%84%EB%A5%98:%ED%95%9C%EA%B5%AD%EC%96%B4_%EB%AA%85%EC%82%AC';
const words = [];

async function crawlWords(url) {
	const html = await rp(url);
	const $ = cheerio.load(html);
  
	$('.mw-category-group > ul > li > a').each((i, el) => {
	  words.push($(el).text());
	});
  
	const prevPageLink = $('#mw-pages>a:last-child');
  
	if (prevPageLink.text() === '다음 페이지') {
	  const prevPageUrl = 'https://ko.wiktionary.org' + prevPageLink.attr('href');
	  await crawlWords(prevPageUrl);
	}
  }
  
crawlWords(url)
.then(() => {
  fs.writeFile('hangle.txt', words.join('\n'), (err) => {
	if (err) throw err;
	console.log('hangle.txt 파일이 생성되었습니다.');
  });
})
.catch((err) => {
  console.log(err);
});