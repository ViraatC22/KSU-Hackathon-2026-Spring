.PHONY: setup setup-web setup-ml verify verify-web verify-ml

setup: setup-web setup-ml

setup-web:
	cd apps/web && npm ci

setup-ml:
	python3 -m venv services/ml-engine/.venv
	services/ml-engine/.venv/bin/python -m pip install -r services/ml-engine/requirements-dev.txt

verify: verify-web verify-ml

verify-web:
	cd apps/web && npm run verify

verify-ml:
	cd services/ml-engine && .venv/bin/python -m pytest -q
