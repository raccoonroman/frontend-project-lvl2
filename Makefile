install: install-deps

run:
	npx babel-node 'src/bin/hexlet.js' 10

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

publish:
	npm publish --dry-run

.PHONY: test

gendiff:
	npx babel-node -- 'src/bin/gendiff.js' --format plain __fixtures__/before.json __fixtures__/after.json
