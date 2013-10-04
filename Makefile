
build: components
	@component build --dev

components: component.json
	@component install --dev

templates:
	@component convert dist/abn_tree_template.html

clean:
	rm -fr build components

.PHONY: clean
