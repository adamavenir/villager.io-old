include node_modules/make-better/core.inc
include node_modules/make-better/frontend.inc

STYLUS_DIR := ./client/styl

# General targets
build: css
css: public/css/main.css

public/css/main.css: $(STYLUS_FILES)
	mkdir -p public/css
	stylus -u yeticss \
		   -u autoprefixer-stylus \
		   -c \
		   -o public/css client/styl/main.styl

# Tests
test-cov:
		@node node_modules/lab/bin/lab -c
test:
		@node node_modules/lab/bin/lab
test-cov-html:
		@node node_modules/lab/bin/lab -r html -o coverage.html
complexity:
		@node node_modules/complexity-report/src/index.js -o complexity.md -f markdown lib/

.PHONY: test test-no-cov test-cov-html complexitycss
