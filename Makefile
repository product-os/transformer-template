.PHONY: dockerize \
	test

TESTDIR = ./test/out
IMAGENAME = source-to-image

all: dockerize test

dockerize:
	docker build -t ${IMAGENAME} .

test: dockerize
	rm -rf ${TESTDIR}
	mkdir ${TESTDIR}
	docker run --rm -it \
		--env-file=test.env \
		-v ${PWD}/test:/usr/src/transformer/test \
		--privileged \
		 ${IMAGENAME} index
	test -f ${TESTDIR}/result.json
	test -f ${TESTDIR}/artifact.tar
