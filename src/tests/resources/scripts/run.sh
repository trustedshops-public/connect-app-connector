#!/bin/bash

pabot --testlevelsplit --processes 1 --outputdir src/tests/results -x circleci-formatted-results.xml --pythonpath src/tests/resources --pythonpath src/tests/resources/page_objects $@ src/tests/tests
