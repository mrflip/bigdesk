---
layout: default
---

In simple words **bigdesk** makes it very easy to see how your Elasticsearch cluster is doing. Just install it as an [elasticsearch plugin](#elasticsearch_plugin), [download locally](#download_locally) or run [online from the web](#online_from_the_web), then point it to the Elasticsearch node REST endpoint and **have fun**. 

*****

<!-- ![bigdesk master screenshot](images/bigdesk-2.0.0-SNAPSHOT.jpg) -->
<!-- ![bigdesk master screenshot](images/bigdesk-master-nodes.png) -->
<!-- ![bigdesk master screenshot](images/bigdesk-master-cluster.png) -->

<section class="slider">
	<div class="flexslider">
	  <ul class="slides">
	    <li>
	      <img src="images/bigdesk-01.png" />
	    </li>
	    <!-- <li>
	      <img src="images/bigdesk-02.png" />
	    </li> -->
	    <li>
	      <img src="images/bigdesk-03.png" />
	    </li>
	    <li>
	      <img src="images/bigdesk-04.png" />
	    </li>
	  </ul>
	</div>
</section>

It pulls data from Elasticsearch REST API and turns it into charts.

Bigdesk supports the following versions of Elasticsearch:

<table>
	<tr><th>Bigdesk</th><th>Elasticsearch</th></tr>
	<tr><td>master</td><td>0.19.x - master</td></tr>
	<tr><td>2.0.0</td><td>0.19.x - 0.20.x</td></tr>
	<tr><td>1.0.0</td><td>0.17.x - 0.18.x</td></tr>
</table>

<div>
<a href="https://twitter.com/bigdesk_" class="twitter-follow-button" data-show-count="false">Follow @bigdesk_</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
</div>

*****

### elasticsearch plugin

To install bigdesk **master** branch as an [elasticsearch plugin](http://www.elasticsearch.org/guide/reference/modules/plugins.html) on a particular elasticsearch node, navigate to the node installation folder and run the following command:

	bin/plugin -install lukas-vlcek/bigdesk

To install a specific version (for example **2.0.0**) run:

	bin/plugin -install lukas-vlcek/bigdesk/2.0.0

Then you can navigate your web browser to `http://<elasticsearch_REST_endpoint>/_plugin/bigdesk/`

*****

### download locally

You can either download and extract bigdesk archive:

- **master**: [zipball](https://github.com/lukas-vlcek/bigdesk/zipball/master), [tarball](https://github.com/lukas-vlcek/bigdesk/tarball/master)
- **2.0.0**: [zipball](https://github.com/lukas-vlcek/bigdesk/zipball/v2.0.0), [tarball](https://github.com/lukas-vlcek/bigdesk/tarball/v2.0.0)
- **1.0.0**: [zipball](https://github.com/lukas-vlcek/bigdesk/zipball/v1.0.0), [tarball](https://github.com/lukas-vlcek/bigdesk/tarball/v1.0.0)

Or you can clone the git repository from GitHub:

	git clone git://github.com/lukas-vlcek/bigdesk.git bigdesk

Then simply open `bigdesk/index.html` in your web broswer.

*****

### online from the web

You can also run bigdesk directly from the web without needing to install it. Just [select the version](v) you want to use and you are ready to go.

*****

### URL parameters

You can use URL parameters to immediately **connect** to a particular **endpoint** or set **history** and **refresh** interval:

##### &mdash; endpoint
URL of elasticsearch node REST endpoint (you might want to use URL encoded value). Defaults to `http://localhost:9200`.

##### &mdash; connect
If set to `true` bigdesk will try to connect immediately to the endpoint. Defaults to `false`.

##### &mdash; refresh
Refresh interval in milliseconds. Defaults to `2000` (2 sec).

##### &mdash; history
How much data in milliseconds to keep in history. Defaults to `300000` (5 min).

For example, to open bigdesk and have it connect to `http://127.0.0.1:9201` endpoint with a `3` sec refresh interval use:

`index.html?endpoint=http://127.0.0.1:9201&connect=true&refresh=3000`

Check [here](https://github.com/lukas-vlcek/bigdesk/blob/0.18.x/README.textile) about supported URL parameters by bigdesk 1.0.0. 

### web browser support

A modern web browsers with SVG support is needed. It has been tested in Safari, Firefox and Chrome.
